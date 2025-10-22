import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Category } from 'src/types/category.type';
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