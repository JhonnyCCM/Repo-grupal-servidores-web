import { Resolver, Query } from '@nestjs/graphql';
import { UserStats, ClassStats, EquipmentStats } from '../types/stats.type';
import { UserHttpService } from '../user/user-http.service';
import { CoachHttpService } from '../coach/coach-http.service';
import { GymClassHttpService } from '../gym-classes/gym-class-http.service';
import { EquipmentHttpService } from '../equipment/equipment-http.service';
import { Status } from '../common/enums';
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
    return this.userHttpService.findAll().pipe(
      map((users: any[]) => ({
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive).length,
        inactiveUsers: users.filter(u => !u.isActive).length,
        adminUsers: users.filter(u => u.role === 'ADMIN').length,
        regularUsers: users.filter(u => u.role === 'USER').length,
        coachUsers: users.filter(u => u.role === 'COACH').length,
      }))
    );
  }

  @Query(() => ClassStats, { name: 'classStats' })
  getClassStats(): Observable<ClassStats> {
    return this.gymClassHttpService.findAll().pipe(
      map((classes: any[]) => ({
        totalClasses: classes.length,
        activeClasses: classes.filter(c => c.isActive).length,
        beginnerClasses: classes.filter(c => c.difficultyLevel === 'BEGINNER').length,
        intermediateClasses: classes.filter(c => c.difficultyLevel === 'INTERMEDIATE').length,
        advancedClasses: classes.filter(c => c.difficultyLevel === 'ADVANCED').length,
        classesWithoutCoach: classes.filter(c => !c.coachId).length,
      }))
    );
  }

  @Query(() => EquipmentStats, { name: 'equipmentStats' })
  getEquipmentStats(): Observable<EquipmentStats> {
    return this.equipmentHttpService.findAll().pipe(
      map((equipment: any[]) => ({
        totalEquipment: equipment.length,
        availableEquipment: equipment.filter(e => e.status === Status.ACTIVE).length,
        inactiveEquipment: equipment.filter(e => e.status === Status.INACTIVE).length,
        maintenanceEquipment: equipment.filter(e => e.status === Status.MAINTENANCE).length,
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
        const availableEquipment = equipment.filter(e => e.status === Status.ACTIVE).length;
        
        return `Dashboard Summary: ${activeUsers} active users, ${activeCoaches} active coaches, ${activeClasses} active classes, ${availableEquipment} available equipment. Total entities: ${users.length + coaches.length + classes.length + equipment.length}`;
      })
    );
  }
}