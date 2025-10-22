import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError } from 'rxjs';
import { Schedule } from '../types/schedule.type';
import { CreateScheduleInput, UpdateScheduleInput, FilterScheduleInput } from '../inputs/schedule.input';

@Injectable()
export class ScheduleHttpService {
  private readonly restUrl = 'http://localhost:3001/schedules';

  constructor(private readonly httpService: HttpService) {}

  findAll(filter?: FilterScheduleInput): Observable<Schedule[]> {
    return this.httpService.get<Schedule[]>(this.restUrl).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching schedules',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  findOne(id: string): Observable<Schedule> {
    return this.httpService.get<Schedule>(`${this.restUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Schedule not found',
          error.response?.status || HttpStatus.NOT_FOUND,
        );
      }),
    );
  }

  create(createScheduleInput: CreateScheduleInput): Observable<Schedule> {
    return this.httpService.post<Schedule>(this.restUrl, createScheduleInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error creating schedule',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  update(id: string, updateScheduleInput: UpdateScheduleInput): Observable<Schedule> {
    return this.httpService.patch<Schedule>(`${this.restUrl}/${id}`, updateScheduleInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error updating schedule',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  remove(id: string): Observable<boolean> {
    return this.httpService.delete(`${this.restUrl}/${id}`).pipe(
      map(() => true),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error deleting schedule',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }
}
