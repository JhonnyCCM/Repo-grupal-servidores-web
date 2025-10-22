import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError } from 'rxjs';
import { ClassEnrollment } from '../types/class-enrollment.type';
import { CreateClassEnrollmentInput, UpdateClassEnrollmentInput, FilterClassEnrollmentInput } from '../inputs/class-enrollment.input';

@Injectable()
export class ClassEnrollmentHttpService {
  private readonly restUrl = 'http://localhost:3001/class-enrollments';

  constructor(private readonly httpService: HttpService) {}

  findAll(filter?: FilterClassEnrollmentInput): Observable<ClassEnrollment[]> {
    return this.httpService.get<ClassEnrollment[]>(this.restUrl).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching class enrollments',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  findOne(id: string): Observable<ClassEnrollment> {
    return this.httpService.get<ClassEnrollment>(`${this.restUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Class enrollment not found',
          error.response?.status || HttpStatus.NOT_FOUND,
        );
      }),
    );
  }

  create(createClassEnrollmentInput: CreateClassEnrollmentInput): Observable<ClassEnrollment> {
    return this.httpService.post<ClassEnrollment>(this.restUrl, createClassEnrollmentInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error creating class enrollment',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  update(id: string, updateClassEnrollmentInput: UpdateClassEnrollmentInput): Observable<ClassEnrollment> {
    return this.httpService.patch<ClassEnrollment>(`${this.restUrl}/${id}`, updateClassEnrollmentInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error updating class enrollment',
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
          error.response?.data?.message || 'Error deleting class enrollment',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  // Consulta compleja: inscripciones por usuario
  findByUserId(userId: string): Observable<ClassEnrollment[]> {
    return this.findAll().pipe(
      map(enrollments => enrollments.filter(enrollment => enrollment.userId === userId))
    );
  }

  // Consulta compleja: inscripciones por clase
  findByClassId(classId: string): Observable<ClassEnrollment[]> {
    return this.findAll().pipe(
      map(enrollments => enrollments.filter(enrollment => enrollment.classId === classId))
    );
  }

  // Consulta compleja: estadísticas de inscripciones
  getEnrollmentStats(): Observable<any> {
    return this.httpService.get(`${this.restUrl}/stats`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching enrollment stats',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}
