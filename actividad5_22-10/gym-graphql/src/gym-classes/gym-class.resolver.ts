import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { Inject, forwardRef } from '@nestjs/common';
import { GymClass } from '../types/gym-classes.type';
import { Coach } from '../types/coach.type';
import { CreateGymClassInput, UpdateGymClassInput, FilterGymClassInput } from '../inputs/gym-class.input';
import { GymClassHttpService } from './gym-class-http.service';
import { CoachHttpService } from '../coach/coach-http.service';
import { Observable } from 'rxjs';

@Resolver(() => GymClass)
export class GymClassResolver {
  constructor(
    private readonly gymClassHttpService: GymClassHttpService,
    @Inject(forwardRef(() => CoachHttpService))
    private readonly coachHttpService: CoachHttpService,
  ) {}

  @Query(() => [GymClass], { name: 'gymClasses' })
  findAll(@Args('filter', { type: () => FilterGymClassInput, nullable: true }) filter?: FilterGymClassInput): Observable<GymClass[]> {
    return this.gymClassHttpService.findAll(filter);
  }

  @Query(() => GymClass, { name: 'gymClass' })
  findOne(@Args('id', { type: () => ID }) id: string): Observable<GymClass> {
    return this.gymClassHttpService.findOne(id);
  }

  @Mutation(() => GymClass)
  createGymClass(@Args('createGymClassInput') createGymClassInput: CreateGymClassInput): Observable<GymClass> {
    return this.gymClassHttpService.create(createGymClassInput);
  }

  @Mutation(() => GymClass)
  updateGymClass(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateGymClassInput') updateGymClassInput: UpdateGymClassInput,
  ): Observable<GymClass> {
    return this.gymClassHttpService.update(id, updateGymClassInput);
  }

  @Mutation(() => Boolean)
  removeGymClass(@Args('id', { type: () => ID }) id: string): Observable<boolean> {
    return this.gymClassHttpService.remove(id);
  }

  // Consultas complejas
  @Query(() => [GymClass], { name: 'classesWithCoach' })
  getClassesWithCoach(): Observable<any> {
    return this.gymClassHttpService.findClassesWithCoach();
  }

  @Query(() => [GymClass], { name: 'classesByDifficulty' })
  getClassesByDifficulty(@Args('difficulty') difficulty: string): Observable<GymClass[]> {
    return this.gymClassHttpService.findByDifficulty(difficulty);
  }

  @Query(() => [GymClass], { name: 'activeClasses' })
  getActiveClasses(): Observable<GymClass[]> {
    return this.gymClassHttpService.findAll({ isActive: true });
  }

  @Query(() => [GymClass], { name: 'classesForCoach' })
  getClassesForCoach(@Args('coachId', { type: () => ID }) coachId: string): Observable<GymClass[]> {
    return this.gymClassHttpService.findAll({ coachId });
  }

  @Query(() => String, { name: 'classStats' })
  getClassStats(): Observable<any> {
    return this.gymClassHttpService.getClassStats();
  }

  // Relations
  @ResolveField(() => Coach)
  coach(@Parent() gymClass: GymClass): Observable<Coach> {
    return this.coachHttpService.findOne(gymClass.coachId);
  }
}