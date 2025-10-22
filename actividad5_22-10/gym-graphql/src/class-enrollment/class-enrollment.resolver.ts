import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { Inject, forwardRef } from '@nestjs/common';
import { ClassEnrollment } from '../types/class-enrollment.type';
import { User } from '../types/user.type';
import { GymClass } from '../types/gym-classes.type';
import { CreateClassEnrollmentInput, UpdateClassEnrollmentInput, FilterClassEnrollmentInput } from '../inputs/class-enrollment.input';
import { ClassEnrollmentHttpService } from './class-enrollment-http.service';
import { UserHttpService } from '../user/user-http.service';
import { GymClassHttpService } from '../gym-classes/gym-class-http.service';
import { Observable } from 'rxjs';

@Resolver(() => ClassEnrollment)
export class ClassEnrollmentResolver {
  constructor(
    private readonly classEnrollmentHttpService: ClassEnrollmentHttpService,
    @Inject(forwardRef(() => UserHttpService))
    private readonly userHttpService: UserHttpService,
    @Inject(forwardRef(() => GymClassHttpService))
    private readonly gymClassHttpService: GymClassHttpService,
  ) {}

  @Query(() => [ClassEnrollment], { name: 'classEnrollments' })
  findAll(@Args('filter', { type: () => FilterClassEnrollmentInput, nullable: true }) filter?: FilterClassEnrollmentInput): Observable<ClassEnrollment[]> {
    return this.classEnrollmentHttpService.findAll(filter);
  }

  @Query(() => ClassEnrollment, { name: 'classEnrollment' })
  findOne(@Args('id', { type: () => ID }) id: string): Observable<ClassEnrollment> {
    return this.classEnrollmentHttpService.findOne(id);
  }

  @Mutation(() => ClassEnrollment)
  createClassEnrollment(@Args('createClassEnrollmentInput') createClassEnrollmentInput: CreateClassEnrollmentInput): Observable<ClassEnrollment> {
    return this.classEnrollmentHttpService.create(createClassEnrollmentInput);
  }

  @Mutation(() => ClassEnrollment)
  updateClassEnrollment(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateClassEnrollmentInput') updateClassEnrollmentInput: UpdateClassEnrollmentInput,
  ): Observable<ClassEnrollment> {
    return this.classEnrollmentHttpService.update(id, updateClassEnrollmentInput);
  }

  @Mutation(() => Boolean)
  removeClassEnrollment(@Args('id', { type: () => ID }) id: string): Observable<boolean> {
    return this.classEnrollmentHttpService.remove(id);
  }

  // Consultas complejas
  @Query(() => [ClassEnrollment], { name: 'enrollmentsByUser' })
  getEnrollmentsByUser(@Args('userId', { type: () => ID }) userId: string): Observable<ClassEnrollment[]> {
    return this.classEnrollmentHttpService.findByUserId(userId);
  }

  @Query(() => [ClassEnrollment], { name: 'enrollmentsByClass' })
  getEnrollmentsByClass(@Args('classId', { type: () => ID }) classId: string): Observable<ClassEnrollment[]> {
    return this.classEnrollmentHttpService.findByClassId(classId);
  }

  @Query(() => String, { name: 'enrollmentStats' })
  getEnrollmentStats(): Observable<any> {
    return this.classEnrollmentHttpService.getEnrollmentStats();
  }

  // Relations
  @ResolveField(() => User)
  user(@Parent() enrollment: ClassEnrollment): Observable<User> {
    return this.userHttpService.findOne(enrollment.userId);
  }

  @ResolveField(() => GymClass)
  gymClass(@Parent() enrollment: ClassEnrollment): Observable<GymClass> {
    return this.gymClassHttpService.findOne(enrollment.classId);
  }
}
