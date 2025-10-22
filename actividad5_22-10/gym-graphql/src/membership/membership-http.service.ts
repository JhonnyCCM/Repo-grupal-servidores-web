import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError } from 'rxjs';
import { Membership } from '../types/membership.type';
import { CreateMembershipInput, UpdateMembershipInput, FilterMembershipInput } from '../inputs/membership.input';

@Injectable()
export class MembershipHttpService {
  private readonly restUrl = 'http://localhost:3001/memberships';

  constructor(private readonly httpService: HttpService) {}

  findAll(filter?: FilterMembershipInput): Observable<Membership[]> {
    return this.httpService.get<Membership[]>(this.restUrl).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching memberships',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  findOne(id: string): Observable<Membership> {
    return this.httpService.get<Membership>(`${this.restUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Membership not found',
          error.response?.status || HttpStatus.NOT_FOUND,
        );
      }),
    );
  }

  create(createMembershipInput: CreateMembershipInput): Observable<Membership> {
    return this.httpService.post<Membership>(this.restUrl, createMembershipInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error creating membership',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  update(id: string, updateMembershipInput: UpdateMembershipInput): Observable<Membership> {
    return this.httpService.patch<Membership>(`${this.restUrl}/${id}`, updateMembershipInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error updating membership',
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
          error.response?.data?.message || 'Error deleting membership',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  // Consulta compleja: membresías activas
  findActiveMemberships(): Observable<Membership[]> {
    return this.httpService.get(`${this.restUrl}/active`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching active memberships',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  // Consulta compleja: membresías por usuario
  findByUserId(userId: string): Observable<Membership[]> {
    return this.httpService.get(`${this.restUrl}/user/${userId}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching memberships by user',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  // Consulta compleja: membresías expiradas
  findExpiredMemberships(): Observable<Membership[]> {
    return this.httpService.get(`${this.restUrl}/expired`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching expired memberships',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}
