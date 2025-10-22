import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { EquipmentCategory } from '../types/equipment_category.type';
import { CreateEquipmentCategoryInput, UpdateEquipmentCategoryInput, FilterEquipmentCategoryInput } from '../inputs/equipment-category.input';
import { EquipmentCategoryHttpService } from './equipment-category-http.service';
import { Observable } from 'rxjs';

@Resolver(() => EquipmentCategory)
export class EquipmentCategoryResolver {
  constructor(
    private readonly equipmentCategoryHttpService: EquipmentCategoryHttpService,
  ) {}

  @Query(() => [EquipmentCategory], { name: 'equipmentCategories' })
  findAll(@Args('filter', { type: () => FilterEquipmentCategoryInput, nullable: true }) filter?: FilterEquipmentCategoryInput): Observable<EquipmentCategory[]> {
    return this.equipmentCategoryHttpService.findAll(filter);
  }

  @Query(() => EquipmentCategory, { name: 'equipmentCategory' })
  findOne(@Args('id', { type: () => ID }) id: string): Observable<EquipmentCategory> {
    return this.equipmentCategoryHttpService.findOne(id);
  }

  @Mutation(() => EquipmentCategory)
  createEquipmentCategory(@Args('createEquipmentCategoryInput') createEquipmentCategoryInput: CreateEquipmentCategoryInput): Observable<EquipmentCategory> {
    return this.equipmentCategoryHttpService.create(createEquipmentCategoryInput);
  }

  @Mutation(() => EquipmentCategory)
  updateEquipmentCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateEquipmentCategoryInput') updateEquipmentCategoryInput: UpdateEquipmentCategoryInput,
  ): Observable<EquipmentCategory> {
    return this.equipmentCategoryHttpService.update(id, updateEquipmentCategoryInput);
  }

  @Mutation(() => String)
  removeEquipmentCategory(@Args('id', { type: () => ID }) id: string): Observable<{ message: string }> {
    return this.equipmentCategoryHttpService.remove(id);
  }
}