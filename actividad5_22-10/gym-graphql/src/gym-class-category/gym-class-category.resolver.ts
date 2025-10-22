import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { GymClassCategory } from '../types/gym-class_category.type';
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