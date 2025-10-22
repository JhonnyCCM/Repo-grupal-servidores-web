import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError, throwError } from 'rxjs';
import { User } from '../types/user.type';
import { CreateUserInput, UpdateUserInput, FilterUserInput } from '../inputs/user.input';

@Injectable()
export class UserHttpService {
  private readonly restUrl = 'http://localhost:3001/users';

  constructor(private readonly httpService: HttpService) {}

  findAll(filter?: FilterUserInput): Observable<User[]> {
    let url = this.restUrl;
    const params = new URLSearchParams();
    
    if (filter?.role) params.append('role', filter.role);
    if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
    if (filter?.search) params.append('search', filter.search);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.httpService.get<User[]>(url).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching users',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  findOne(id: string): Observable<User> {
    return this.httpService.get<User>(`${this.restUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'User not found',
          error.response?.status || HttpStatus.NOT_FOUND,
        );
      }),
    );
  }

  create(createUserInput: CreateUserInput): Observable<User> {
    return this.httpService.post<User>(this.restUrl, createUserInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error creating user',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  update(id: string, updateUserInput: UpdateUserInput): Observable<User> {
    return this.httpService.patch<User>(`${this.restUrl}/${id}`, updateUserInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error updating user',
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
          error.response?.data?.message || 'Error deleting user',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  // Consulta compleja: usuarios activos con estadísticas
  getUsersWithStats(): Observable<any> {
    return this.httpService.get(`${this.restUrl}/stats`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching user stats',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}