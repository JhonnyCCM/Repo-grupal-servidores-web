import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError } from 'rxjs';
import { GymClass } from '../types/gym-classes.type';
import { CreateGymClassInput, UpdateGymClassInput, FilterGymClassInput } from '../inputs/gym-class.input';

@Injectable()
export class GymClassHttpService {
  private readonly restUrl = 'http://localhost:3001/gym-classes';

  constructor(private readonly httpService: HttpService) {}

  findAll(filter?: FilterGymClassInput): Observable<GymClass[]> {
    let url = this.restUrl;
    const params = new URLSearchParams();
    
    if (filter?.difficultyLevel) params.append('difficultyLevel', filter.difficultyLevel);
    if (filter?.coachId) params.append('coachId', filter.coachId);
    if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
    if (filter?.search) params.append('search', filter.search);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.httpService.get<GymClass[]>(url).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching gym classes',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  findOne(id: string): Observable<GymClass> {
    return this.httpService.get<GymClass>(`${this.restUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Gym class not found',
          error.response?.status || HttpStatus.NOT_FOUND,
        );
      }),
    );
  }

  create(createGymClassInput: CreateGymClassInput): Observable<GymClass> {
    return this.httpService.post<GymClass>(this.restUrl, createGymClassInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error creating gym class',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  update(id: string, updateGymClassInput: UpdateGymClassInput): Observable<GymClass> {
    return this.httpService.patch<GymClass>(`${this.restUrl}/${id}`, updateGymClassInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error updating gym class',
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
          error.response?.data?.message || 'Error deleting gym class',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  // Consulta compleja: clases con detalles del coach
  findClassesWithCoach(): Observable<any> {
    return this.httpService.get(`${this.restUrl}/with-coach`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching classes with coach',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  // Consulta compleja: clases por nivel de dificultad
  findByDifficulty(difficulty: string): Observable<GymClass[]> {
    return this.httpService.get(`${this.restUrl}/difficulty/${difficulty}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching classes by difficulty',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  // Consulta compleja: estadísticas de clases
  getClassStats(): Observable<any> {
    return this.httpService.get(`${this.restUrl}/stats`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching class stats',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}