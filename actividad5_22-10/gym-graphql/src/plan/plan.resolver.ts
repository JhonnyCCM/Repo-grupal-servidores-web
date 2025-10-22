import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Plan } from '../types/plan.type';
import { CreatePlanInput, UpdatePlanInput, FilterPlanInput } from '../inputs/plan.input';
import { PlanHttpService } from './plan-http.service';
import { Observable } from 'rxjs';

@Resolver(() => Plan)
export class PlanResolver {
  constructor(private readonly planHttpService: PlanHttpService) {}

  @Query(() => [Plan], { name: 'plans' })
  findAll(@Args('filter', { type: () => FilterPlanInput, nullable: true }) filter?: FilterPlanInput): Observable<Plan[]> {
    return this.planHttpService.findAll(filter);
  }

  @Query(() => Plan, { name: 'plan' })
  findOne(@Args('id', { type: () => ID }) id: string): Observable<Plan> {
    return this.planHttpService.findOne(id);
  }

  @Mutation(() => Plan)
  createPlan(@Args('createPlanInput') createPlanInput: CreatePlanInput): Observable<Plan> {
    return this.planHttpService.create(createPlanInput);
  }

  @Mutation(() => Plan)
  updatePlan(
    @Args('id', { type: () => ID }) id: string,
    @Args('updatePlanInput') updatePlanInput: UpdatePlanInput,
  ): Observable<Plan> {
    return this.planHttpService.update(id, updatePlanInput);
  }

  @Mutation(() => Boolean)
  removePlan(@Args('id', { type: () => ID }) id: string): Observable<boolean> {
    return this.planHttpService.remove(id);
  }

  // Consultas complejas
  @Query(() => [Plan], { name: 'activePlans' })
  getActivePlans(): Observable<Plan[]> {
    return this.planHttpService.findActivePlans();
  }

  @Query(() => [Plan], { name: 'plansByPriceRange' })
  getPlansByPriceRange(
    @Args('minPrice', { type: () => Number }) minPrice: number,
    @Args('maxPrice', { type: () => Number }) maxPrice: number,
  ): Observable<Plan[]> {
    return this.planHttpService.findByPriceRange(minPrice, maxPrice);
  }
}
