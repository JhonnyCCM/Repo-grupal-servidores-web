import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError } from 'rxjs';
import { Coach } from '../types/coach.type';
import { CreateCoachInput, UpdateCoachInput, FilterCoachInput } from '../inputs/coach.input';

@Injectable()
export class CoachHttpService {
  private readonly restUrl = 'http://localhost:3001/coaches';

  constructor(private readonly httpService: HttpService) {}

  findAll(filter?: FilterCoachInput): Observable<Coach[]> {
    let url = this.restUrl;
    const params = new URLSearchParams();
    
    if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
    if (filter?.search) params.append('search', filter.search);
    if (filter?.minExperience) params.append('minExperience', filter.minExperience.toString());
    if (filter?.specialty) params.append('specialty', filter.specialty);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.httpService.get<Coach[]>(url).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching coaches',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  findOne(id: string): Observable<Coach> {
    return this.httpService.get<Coach>(`${this.restUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Coach not found',
          error.response?.status || HttpStatus.NOT_FOUND,
        );
      }),
    );
  }

  create(createCoachInput: CreateCoachInput): Observable<Coach> {
    return this.httpService.post<Coach>(this.restUrl, createCoachInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error creating coach',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  update(id: string, updateCoachInput: UpdateCoachInput): Observable<Coach> {
    return this.httpService.patch<Coach>(`${this.restUrl}/${id}`, updateCoachInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error updating coach',
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
          error.response?.data?.message || 'Error deleting coach',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  // Consulta compleja: coaches con sus clases
  findCoachesWithClasses(): Observable<any> {
    return this.httpService.get(`${this.restUrl}/with-classes`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching coaches with classes',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  // Consulta compleja: coaches por especialidad
  findBySpecialty(specialty: string): Observable<Coach[]> {
    return this.httpService.get(`${this.restUrl}/specialty/${specialty}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching coaches by specialty',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}