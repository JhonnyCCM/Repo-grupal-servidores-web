import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Schedule } from '../types/schedule.type';
import { CreateScheduleInput, UpdateScheduleInput, FilterScheduleInput } from '../inputs/schedule.input';
import { ScheduleHttpService } from './schedule-http.service';
import { Observable } from 'rxjs';

@Resolver(() => Schedule)
export class ScheduleResolver {
  constructor(private readonly scheduleHttpService: ScheduleHttpService) {}

  @Query(() => [Schedule], { name: 'schedules' })
  findAll(@Args('filter', { type: () => FilterScheduleInput, nullable: true }) filter?: FilterScheduleInput): Observable<Schedule[]> {
    return this.scheduleHttpService.findAll(filter);
  }

  @Query(() => Schedule, { name: 'schedule' })
  findOne(@Args('id', { type: () => ID }) id: string): Observable<Schedule> {
    return this.scheduleHttpService.findOne(id);
  }

  @Mutation(() => Schedule)
  createSchedule(@Args('createScheduleInput') createScheduleInput: CreateScheduleInput): Observable<Schedule> {
    return this.scheduleHttpService.create(createScheduleInput);
  }

  @Mutation(() => Schedule)
  updateSchedule(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateScheduleInput') updateScheduleInput: UpdateScheduleInput,
  ): Observable<Schedule> {
    return this.scheduleHttpService.update(id, updateScheduleInput);
  }

  @Mutation(() => Boolean)
  removeSchedule(@Args('id', { type: () => ID }) id: string): Observable<boolean> {
    return this.scheduleHttpService.remove(id);
  }
}
