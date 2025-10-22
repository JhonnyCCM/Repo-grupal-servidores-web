import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError } from 'rxjs';
import { GymClassCategory } from '../types/gym-class_category.type';
import { CreateGymClassCategoryInput, UpdateGymClassCategoryInput, FilterGymClassCategoryInput } from '../inputs/gym-class-category.input';

@Injectable()
export class GymClassCategoryHttpService {
  private readonly restUrl = 'http://localhost:3001/gym-class-categories';

  constructor(private readonly httpService: HttpService) {}

  findAll(filter?: FilterGymClassCategoryInput): Observable<GymClassCategory[]> {
    let url = this.restUrl;
    const params = new URLSearchParams();
    
    if (filter?.classId) params.append('classId', filter.classId);
    if (filter?.categoryId) params.append('categoryId', filter.categoryId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.httpService.get<GymClassCategory[]>(url).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching gym class categories',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  findOne(id: string): Observable<GymClassCategory> {
    return this.httpService.get<GymClassCategory>(`${this.restUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Gym class category not found',
          error.response?.status || HttpStatus.NOT_FOUND,
        );
      }),
    );
  }

  create(createGymClassCategoryInput: CreateGymClassCategoryInput): Observable<GymClassCategory> {
    return this.httpService.post<GymClassCategory>(this.restUrl, createGymClassCategoryInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error creating gym class category',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  update(id: string, updateGymClassCategoryInput: UpdateGymClassCategoryInput): Observable<GymClassCategory> {
    return this.httpService.put<GymClassCategory>(`${this.restUrl}/${id}`, updateGymClassCategoryInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error updating gym class category',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  remove(id: string): Observable<{ message: string }> {
    return this.httpService.delete<{ message: string }>(`${this.restUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error deleting gym class category',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }
}