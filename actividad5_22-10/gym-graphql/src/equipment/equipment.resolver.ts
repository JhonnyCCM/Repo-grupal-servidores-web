import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Equipment } from '../types/equipment.type';
import { CreateEquipmentInput, UpdateEquipmentInput, FilterEquipmentInput } from '../inputs/equipment.input';
import { EquipmentHttpService } from './equipment-http.service';
import { Observable } from 'rxjs';

@Resolver(() => Equipment)
export class EquipmentResolver {
  constructor(private readonly equipmentHttpService: EquipmentHttpService) {}

  @Query(() => [Equipment], { name: 'equipment' })
  findAll(@Args('filter', { type: () => FilterEquipmentInput, nullable: true }) filter?: FilterEquipmentInput): Observable<Equipment[]> {
    return this.equipmentHttpService.findAll(filter);
  }

  @Query(() => Equipment, { name: 'equipmentById' })
  findOne(@Args('id', { type: () => ID }) id: string): Observable<Equipment> {
    return this.equipmentHttpService.findOne(id);
  }

  @Mutation(() => Equipment)
  createEquipment(@Args('createEquipmentInput') createEquipmentInput: CreateEquipmentInput): Observable<Equipment> {
    return this.equipmentHttpService.create(createEquipmentInput);
  }

  @Mutation(() => Equipment)
  updateEquipment(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateEquipmentInput') updateEquipmentInput: UpdateEquipmentInput,
  ): Observable<Equipment> {
    return this.equipmentHttpService.update(id, updateEquipmentInput);
  }

  @Mutation(() => Boolean)
  removeEquipment(@Args('id', { type: () => ID }) id: string): Observable<boolean> {
    return this.equipmentHttpService.remove(id);
  }

  // Consultas complejas
  @Query(() => [Equipment], { name: 'availableEquipment' })
  getAvailableEquipment(): Observable<Equipment[]> {
    return this.equipmentHttpService.findAvailable();
  }

  @Query(() => [Equipment], { name: 'equipmentByStatus' })
  getEquipmentByStatus(@Args('status') status: string): Observable<Equipment[]> {
    return this.equipmentHttpService.findByStatus(status);
  }

  @Query(() => [Equipment], { name: 'maintenanceEquipment' })
  getMaintenanceEquipment(): Observable<Equipment[]> {
    return this.equipmentHttpService.findAll({ status: 'MAINTENANCE' as any });
  }

  @Query(() => String, { name: 'equipmentStats' })
  getEquipmentStats(): Observable<any> {
    return this.equipmentHttpService.getEquipmentStats();
  }
}