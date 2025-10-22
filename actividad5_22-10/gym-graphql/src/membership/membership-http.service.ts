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
    return this.findAll().pipe(
      map(memberships => memberships.filter((m: any) => m.status === 'ACTIVE' || m.status === 'Activa'))
    );
  }

  // Consulta compleja: membresías por usuario
  findByUserId(userId: string): Observable<Membership[]> {
    return this.findAll().pipe(
      map(memberships => memberships.filter(m => m.userId === userId))
    );
  }

  // Consulta compleja: membresías expiradas
  findExpiredMemberships(): Observable<Membership[]> {
    return this.findAll().pipe(
      map(memberships => memberships.filter((m: any) => {
        // Check by status
        if (m.status === 'EXPIRED' || m.status === 'Expirada') {
          return true;
        }
        // Check by end date
        if (m.endDate) {
          const endDate = new Date(m.endDate);
          const now = new Date();
          return endDate < now;
        }
        return false;
      }))
    );
  }
}
