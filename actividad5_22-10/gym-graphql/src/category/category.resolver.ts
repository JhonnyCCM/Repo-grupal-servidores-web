import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { Category } from 'src/types/category.type';
import { CategoryStats, StatsFilterInput } from 'src/types/stats.type';
import { CreateCategoryInput, UpdateCategoryInput, FilterCategoryInput } from 'src/inputs/category.input';
import { CategoryHttpService } from './category-http.service';
import { Observable } from 'rxjs';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly categoryHttpService: CategoryHttpService,
  ) {}

  @Query(() => [Category], { name: 'categories' })
  findAll(@Args('filter', { type: () => FilterCategoryInput, nullable: true }) filter?: FilterCategoryInput): Observable<Category[]> {
    return this.categoryHttpService.findAll(filter);
  }

  @Query(() => Category, { name: 'category' })
  findOne(@Args('id', { type: () => ID }) id: string): Observable<Category> {
    return this.categoryHttpService.findOne(id);
  }

  // Nuevos queries complejos
  @Query(() => [Category], { name: 'searchCategories', description: 'Búsqueda avanzada de categorías con texto libre' })
  searchCategories(
    @Args('searchText') searchText: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 }) limit?: number
  ): Observable<Category[]> {
    const filter: FilterCategoryInput = {
      searchText,
      pagination: { take: limit }
    };
    return this.categoryHttpService.findAll(filter);
  }

  @Query(() => [Category], { name: 'categoriesByDateRange', description: 'Obtener categorías creadas en un rango de fechas' })
  categoriesByDateRange(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string
  ): Observable<Category[]> {
    const filter: FilterCategoryInput = {
      createdAtFilter: {
        operator: 'between' as any,
        value: startDate,
        endValue: endDate
      }
    };
    return this.categoryHttpService.findAll(filter);
  }

  @Query(() => [Category], { name: 'categoriesWithDescription', description: 'Obtener categorías que tienen o no descripción' })
  categoriesWithDescription(
    @Args('hasDescription', { type: () => Boolean }) hasDescription: boolean
  ): Observable<Category[]> {
    const filter: FilterCategoryInput = {
      hasDescription
    };
    return this.categoryHttpService.findAll(filter);
  }

  @Query(() => [Category], { name: 'categoriesByNamePattern', description: 'Buscar categorías por patrón de nombre' })
  categoriesByNamePattern(
    @Args('pattern') pattern: string,
    @Args('caseSensitive', { type: () => Boolean, nullable: true, defaultValue: false }) caseSensitive?: boolean
  ): Observable<Category[]> {
    const filter: FilterCategoryInput = {
      nameFilter: {
        operator: 'contains' as any,
        value: pattern,
        caseSensitive
      }
    };
    return this.categoryHttpService.findAll(filter);
  }

  @Query(() => Int, { name: 'categoriesCount', description: 'Contar categorías que coinciden con el filtro' })
  categoriesCount(
    @Args('filter', { type: () => FilterCategoryInput, nullable: true }) filter?: FilterCategoryInput
  ): Observable<number> {
    return this.categoryHttpService.count(filter);
  }

  // Nuevos queries de estadísticas
  @Query(() => CategoryStats, { name: 'categoryStatistics', description: 'Obtener estadísticas detalladas de categorías' })
  categoryStatistics(
    @Args('filter', { type: () => StatsFilterInput, nullable: true }) filter?: StatsFilterInput
  ): Observable<CategoryStats> {
    return this.categoryHttpService.getStatistics(filter);
  }

  @Query(() => [Category], { name: 'popularCategories', description: 'Obtener las categorías más populares ordenadas por uso' })
  popularCategories(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit?: number
  ): Observable<Category[]> {
    return this.categoryHttpService.getPopularCategories(limit);
  }

  @Query(() => [Category], { name: 'recentCategories', description: 'Obtener las categorías creadas más recientemente' })
  recentCategories(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit?: number,
    @Args('days', { type: () => Int, nullable: true, defaultValue: 30 }) days?: number
  ): Observable<Category[]> {
    const filter: FilterCategoryInput = {
      sort: [{ field: 'CREATED_AT' as any, order: 'DESC' as any }],
      pagination: { take: limit }
    };
    return this.categoryHttpService.findAll(filter);
  }

  @Mutation(() => Category)
  createCategory(@Args('createCategoryInput') createCategoryInput: CreateCategoryInput): Observable<Category> {
    return this.categoryHttpService.create(createCategoryInput);
  }

  @Mutation(() => Category)
  updateCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ): Observable<Category> {
    return this.categoryHttpService.update(id, updateCategoryInput);
  }

  @Mutation(() => String)
  removeCategory(@Args('id', { type: () => ID }) id: string): Observable<{ message: string }> {
    return this.categoryHttpService.remove(id);
  }
}