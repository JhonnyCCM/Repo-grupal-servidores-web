import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { Inject, forwardRef } from '@nestjs/common';
import { Coach } from '../types/coach.type';
import { GymClass } from '../types/gym-classes.type';
import { CreateCoachInput, UpdateCoachInput, FilterCoachInput } from '../inputs/coach.input';
import { CoachHttpService } from './coach-http.service';
import { GymClassHttpService } from '../gym-classes/gym-class-http.service';
import { Observable } from 'rxjs';

@Resolver(() => Coach)
export class CoachResolver {
  constructor(
    private readonly coachHttpService: CoachHttpService,
    @Inject(forwardRef(() => GymClassHttpService))
    private readonly gymClassHttpService: GymClassHttpService,
  ) {}

  @Query(() => [Coach], { name: 'coaches' })
  findAll(@Args('filter', { type: () => FilterCoachInput, nullable: true }) filter?: FilterCoachInput): Observable<Coach[]> {
    return this.coachHttpService.findAll(filter);
  }

  @Query(() => Coach, { name: 'coach' })
  findOne(@Args('id', { type: () => ID }) id: string): Observable<Coach> {
    return this.coachHttpService.findOne(id);
  }

  @Mutation(() => Coach)
  createCoach(@Args('createCoachInput') createCoachInput: CreateCoachInput): Observable<Coach> {
    return this.coachHttpService.create(createCoachInput);
  }

  @Mutation(() => Coach)
  updateCoach(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCoachInput') updateCoachInput: UpdateCoachInput,
  ): Observable<Coach> {
    return this.coachHttpService.update(id, updateCoachInput);
  }

  @Mutation(() => Boolean)
  removeCoach(@Args('id', { type: () => ID }) id: string): Observable<boolean> {
    return this.coachHttpService.remove(id);
  }

  // Consultas complejas
  @Query(() => [Coach], { name: 'coachesWithClasses' })
  getCoachesWithClasses(): Observable<any> {
    return this.coachHttpService.findCoachesWithClasses();
  }

  @Query(() => [Coach], { name: 'coachesBySpecialty' })
  getCoachesBySpecialty(@Args('specialty') specialty: string): Observable<Coach[]> {
    return this.coachHttpService.findBySpecialty(specialty);
  }

  @Query(() => [Coach], { name: 'experiencedCoaches' })
  getExperiencedCoaches(@Args('minYears', { type: () => Number }) minYears: number): Observable<Coach[]> {
    return this.coachHttpService.findAll({ minExperience: minYears });
  }

  @Query(() => [Coach], { name: 'activeCoaches' })
  getActiveCoaches(): Observable<Coach[]> {
    return this.coachHttpService.findAll({ isActive: true });
  }

  // Relations resolver - esto se ejecutará cuando GraphQL solicite el campo classes
  @ResolveField(() => [GymClass])
  classes(@Parent() coach: Coach): Observable<GymClass[]> {
    return this.gymClassHttpService.findAll({ coachId: coach.id });
  }
}