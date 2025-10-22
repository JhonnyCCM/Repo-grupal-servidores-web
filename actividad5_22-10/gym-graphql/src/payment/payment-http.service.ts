import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError } from 'rxjs';
import { Payment } from '../types/payment.type';
import { CreatePaymentInput, UpdatePaymentInput, FilterPaymentInput } from '../inputs/payment.input';

@Injectable()
export class PaymentHttpService {
  private readonly restUrl = 'http://localhost:3001/payments';

  constructor(private readonly httpService: HttpService) {}

  findAll(filter?: FilterPaymentInput): Observable<Payment[]> {
    return this.httpService.get<Payment[]>(this.restUrl).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching payments',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  findOne(id: string): Observable<Payment> {
    return this.httpService.get<Payment>(`${this.restUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Payment not found',
          error.response?.status || HttpStatus.NOT_FOUND,
        );
      }),
    );
  }

  create(createPaymentInput: CreatePaymentInput): Observable<Payment> {
    return this.httpService.post<Payment>(this.restUrl, createPaymentInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error creating payment',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  update(id: string, updatePaymentInput: UpdatePaymentInput): Observable<Payment> {
    return this.httpService.patch<Payment>(`${this.restUrl}/${id}`, updatePaymentInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error updating payment',
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
          error.response?.data?.message || 'Error deleting payment',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  // Consulta compleja: pagos completados
  findCompletedPayments(): Observable<Payment[]> {
    return this.httpService.get(`${this.restUrl}/completed`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching completed payments',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  // Consulta compleja: pagos pendientes
  findPendingPayments(): Observable<Payment[]> {
    return this.httpService.get(`${this.restUrl}/pending`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching pending payments',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  // Consulta compleja: pagos por usuario
  findByUserId(userId: string): Observable<Payment[]> {
    return this.httpService.get(`${this.restUrl}/user/${userId}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching payments by user',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  // Consulta compleja: estadísticas de pagos
  getPaymentStats(): Observable<any> {
    return this.httpService.get(`${this.restUrl}/stats`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching payment stats',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}
