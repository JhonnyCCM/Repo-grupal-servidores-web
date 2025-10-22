import { Resolver, Query } from '@nestjs/graphql';
import { UserStats, ClassStats, EquipmentStats } from '../types/stats.type';
import { UserHttpService } from '../user/user-http.service';
import { CoachHttpService } from '../coach/coach-http.service';
import { GymClassHttpService } from '../gym-classes/gym-class-http.service';
import { EquipmentHttpService } from '../equipment/equipment-http.service';
import { Observable, forkJoin, map } from 'rxjs';

@Resolver()
export class StatsResolver {
  constructor(
    private readonly userHttpService: UserHttpService,
    private readonly coachHttpService: CoachHttpService,
    private readonly gymClassHttpService: GymClassHttpService,
    private readonly equipmentHttpService: EquipmentHttpService,
  ) {}

  @Query(() => UserStats, { name: 'userStats' })
  getUserStats(): Observable<UserStats> {
    return this.userHttpService.getUsersWithStats().pipe(
      map((stats: any) => ({
        totalUsers: stats.total || 0,
        activeUsers: stats.active || 0,
        inactiveUsers: stats.inactive || 0,
        adminUsers: stats.admins || 0,
        regularUsers: stats.users || 0,
        coachUsers: stats.coaches || 0,
      }))
    );
  }

  @Query(() => ClassStats, { name: 'classStats' })
  getClassStats(): Observable<ClassStats> {
    return this.gymClassHttpService.getClassStats().pipe(
      map((stats: any) => ({
        totalClasses: stats.total || 0,
        activeClasses: stats.active || 0,
        beginnerClasses: stats.beginner || 0,
        intermediateClasses: stats.intermediate || 0,
        advancedClasses: stats.advanced || 0,
        classesWithoutCoach: stats.withoutCoach || 0,
      }))
    );
  }

  @Query(() => EquipmentStats, { name: 'equipmentStats' })
  getEquipmentStats(): Observable<EquipmentStats> {
    return this.equipmentHttpService.getEquipmentStats().pipe(
      map((stats: any) => ({
        totalEquipment: stats.total || 0,
        availableEquipment: stats.available || 0,
        inactiveEquipment: stats.inactive || 0,
        maintenanceEquipment: stats.maintenance || 0,
      }))
    );
  }

  // Consulta compleja combinando múltiples servicios incluyendo equipos
  @Query(() => String, { name: 'dashboardSummary' })
  getDashboardSummary(): Observable<string> {
    return forkJoin({
      users: this.userHttpService.findAll(),
      coaches: this.coachHttpService.findAll(),
      classes: this.gymClassHttpService.findAll(),
      equipment: this.equipmentHttpService.findAll(),
    }).pipe(
      map(({ users, coaches, classes, equipment }) => {
        const activeUsers = users.filter(u => u.isActive).length;
        const activeCoaches = coaches.filter(c => c.isActive).length;
        const activeClasses = classes.filter(c => c.isActive).length;
        const availableEquipment = equipment.filter(e => e.status === 'Disponible').length;
        
        return `Dashboard Summary: ${activeUsers} active users, ${activeCoaches} active coaches, ${activeClasses} active classes, ${availableEquipment} available equipment. Total entities: ${users.length + coaches.length + classes.length + equipment.length}`;
      })
    );
  }
}