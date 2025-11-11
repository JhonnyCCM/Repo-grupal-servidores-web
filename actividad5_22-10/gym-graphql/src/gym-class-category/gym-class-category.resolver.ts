import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { GymClassCategory } from '../types/gym-class_category.type';
import { GymClassCategoryStats, StatsFilterInput } from '../types/stats.type';
import { CreateGymClassCategoryInput, UpdateGymClassCategoryInput, FilterGymClassCategoryInput } from '../inputs/gym-class-category.input';
import { GymClassCategoryHttpService } from './gym-class-category-http.service';
import { Observable } from 'rxjs';

@Resolver(() => GymClassCategory)
export class GymClassCategoryResolver {
  constructor(
    private readonly gymClassCategoryHttpService: GymClassCategoryHttpService,
  ) {}

  @Query(() => [GymClassCategory], { name: 'gymClassCategories' })
  findAll(@Args('filter', { type: () => FilterGymClassCategoryInput, nullable: true }) filter?: FilterGymClassCategoryInput): Observable<GymClassCategory[]> {
    return this.gymClassCategoryHttpService.findAll(filter);
  }

  @Query(() => GymClassCategory, { name: 'gymClassCategory' })
  findOne(@Args('id', { type: () => ID }) id: string): Observable<GymClassCategory> {
    return this.gymClassCategoryHttpService.findOne(id);
  }

  // Nuevos queries complejos
  @Query(() => [GymClassCategory], { name: 'gymClassCategoriesByClass', description: 'Obtener todas las categorías de una clase específica' })
  gymClassCategoriesByClass(
    @Args('classId') classId: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number
  ): Observable<GymClassCategory[]> {
    const filter: FilterGymClassCategoryInput = {
      classId,
      pagination: limit ? { take: limit } : undefined
    };
    return this.gymClassCategoryHttpService.findAll(filter);
  }

  @Query(() => [GymClassCategory], { name: 'gymClassCategoriesByCategory', description: 'Obtener todas las clases de una categoría específica' })
  gymClassCategoriesByCategory(
    @Args('categoryId') categoryId: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number
  ): Observable<GymClassCategory[]> {
    const filter: FilterGymClassCategoryInput = {
      categoryId,
      pagination: limit ? { take: limit } : undefined
    };
    return this.gymClassCategoryHttpService.findAll(filter);
  }

  @Query(() => [GymClassCategory], { name: 'gymClassCategoriesByMultipleClasses', description: 'Obtener categorías de múltiples clases' })
  gymClassCategoriesByMultipleClasses(
    @Args('classIds', { type: () => [String] }) classIds: string[]
  ): Observable<GymClassCategory[]> {
    const filter: FilterGymClassCategoryInput = {
      classIds
    };
    return this.gymClassCategoryHttpService.findAll(filter);
  }

  @Query(() => [GymClassCategory], { name: 'gymClassCategoriesByMultipleCategories', description: 'Obtener clases de múltiples categorías' })
  gymClassCategoriesByMultipleCategories(
    @Args('categoryIds', { type: () => [String] }) categoryIds: string[]
  ): Observable<GymClassCategory[]> {
    const filter: FilterGymClassCategoryInput = {
      categoryIds
    };
    return this.gymClassCategoryHttpService.findAll(filter);
  }

  @Query(() => [GymClassCategory], { name: 'gymClassCategoriesByDateRange', description: 'Obtener asociaciones creadas en un rango de fechas' })
  gymClassCategoriesByDateRange(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string
  ): Observable<GymClassCategory[]> {
    const filter: FilterGymClassCategoryInput = {
      createdAfter: startDate,
      createdBefore: endDate
    };
    return this.gymClassCategoryHttpService.findAll(filter);
  }

  @Query(() => [GymClassCategory], { name: 'gymClassCategoriesExcluding', description: 'Obtener asociaciones excluyendo ciertos IDs' })
  gymClassCategoriesExcluding(
    @Args('excludeIds', { type: () => [String] }) excludeIds: string[],
    @Args('excludeClassIds', { type: () => [String], nullable: true }) excludeClassIds?: string[],
    @Args('excludeCategoryIds', { type: () => [String], nullable: true }) excludeCategoryIds?: string[]
  ): Observable<GymClassCategory[]> {
    const filter: FilterGymClassCategoryInput = {
      excludeIds,
      excludeClassIds,
      excludeCategoryIds
    };
    return this.gymClassCategoryHttpService.findAll(filter);
  }

  @Query(() => Int, { name: 'gymClassCategoriesCount', description: 'Contar asociaciones que coinciden con el filtro' })
  gymClassCategoriesCount(
    @Args('filter', { type: () => FilterGymClassCategoryInput, nullable: true }) filter?: FilterGymClassCategoryInput
  ): Observable<number> {
    return this.gymClassCategoryHttpService.count(filter);
  }

  @Query(() => [String], { name: 'uniqueClassIds', description: 'Obtener IDs únicos de clases en las asociaciones' })
  uniqueClassIds(
    @Args('filter', { type: () => FilterGymClassCategoryInput, nullable: true }) filter?: FilterGymClassCategoryInput
  ): Observable<string[]> {
    return this.gymClassCategoryHttpService.getUniqueClassIds(filter);
  }

  @Query(() => [String], { name: 'uniqueCategoryIds', description: 'Obtener IDs únicos de categorías en las asociaciones' })
  uniqueCategoryIds(
    @Args('filter', { type: () => FilterGymClassCategoryInput, nullable: true }) filter?: FilterGymClassCategoryInput
  ): Observable<string[]> {
    return this.gymClassCategoryHttpService.getUniqueCategoryIds(filter);
  }

  // Nuevos queries de estadísticas
  @Query(() => GymClassCategoryStats, { name: 'gymClassCategoryStatistics', description: 'Obtener estadísticas detalladas de asociaciones clase-categoría' })
  gymClassCategoryStatistics(
    @Args('filter', { type: () => StatsFilterInput, nullable: true }) filter?: StatsFilterInput
  ): Observable<GymClassCategoryStats> {
    return this.gymClassCategoryHttpService.getStatistics(filter);
  }

  @Query(() => [GymClassCategory], { name: 'mostActiveClassCategories', description: 'Obtener las asociaciones más activas' })
  mostActiveClassCategories(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit?: number
  ): Observable<GymClassCategory[]> {
    return this.gymClassCategoryHttpService.getMostActive(limit);
  }

  @Query(() => [GymClassCategory], { name: 'recentAssociations', description: 'Obtener las asociaciones más recientes' })
  recentAssociations(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit?: number,
    @Args('hours', { type: () => Int, nullable: true, defaultValue: 24 }) hours?: number
  ): Observable<GymClassCategory[]> {
    const now = new Date();
    const hoursValue = hours || 24;
    const startDate = new Date(now.getTime() - (hoursValue * 60 * 60 * 1000));
    
    const filter: FilterGymClassCategoryInput = {
      createdAfter: startDate.toISOString(),
      sort: [{ field: 'CREATED_AT' as any, order: 'DESC' as any }],
      pagination: { take: limit }
    };
    return this.gymClassCategoryHttpService.findAll(filter);
  }

  @Query(() => [GymClassCategory], { name: 'orphanedAssociations', description: 'Obtener asociaciones sin relaciones válidas' })
  orphanedAssociations(): Observable<GymClassCategory[]> {
    const filter: FilterGymClassCategoryInput = {
      OR: [
        { hasValidClass: false },
        { hasValidCategory: false }
      ]
    };
    return this.gymClassCategoryHttpService.findAll(filter);
  }

  @Mutation(() => GymClassCategory)
  createGymClassCategory(@Args('createGymClassCategoryInput') createGymClassCategoryInput: CreateGymClassCategoryInput): Observable<GymClassCategory> {
    return this.gymClassCategoryHttpService.create(createGymClassCategoryInput);
  }

  @Mutation(() => GymClassCategory)
  updateGymClassCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateGymClassCategoryInput') updateGymClassCategoryInput: UpdateGymClassCategoryInput,
  ): Observable<GymClassCategory> {
    return this.gymClassCategoryHttpService.update(id, updateGymClassCategoryInput);
  }

  @Mutation(() => String)
  removeGymClassCategory(@Args('id', { type: () => ID }) id: string): Observable<{ message: string }> {
    return this.gymClassCategoryHttpService.remove(id);
  }
}