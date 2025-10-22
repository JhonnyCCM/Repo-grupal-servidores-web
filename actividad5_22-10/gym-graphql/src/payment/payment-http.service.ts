import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError } from 'rxjs';
import { Payment } from '../types/payment.type';
import { CreatePaymentInput, UpdatePaymentInput, FilterPaymentInput } from '../inputs/payment.input';
import { PaymentStatus } from '../common/enums';

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
        const errorMessage = error.response?.data?.message || error.message || 'Error creating payment';
        const errorDetails = error.response?.data?.error ? ` - ${error.response.data.error}` : '';
        throw new HttpException(
          `${errorMessage}${errorDetails}`,
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
    return this.findAll().pipe(
      map(payments => payments.filter((payment: any) => payment.status === PaymentStatus.COMPLETED || payment.status === 'COMPLETED'))
    );
  }

  // Consulta compleja: pagos pendientes
  findPendingPayments(): Observable<Payment[]> {
    return this.findAll().pipe(
      map(payments => payments.filter((payment: any) => payment.status === PaymentStatus.PENDING || payment.status === 'PENDING'))
    );
  }

  // Consulta compleja: pagos por usuario
  findByUserId(userId: string): Observable<Payment[]> {
    return this.findAll().pipe(
      map(payments => payments.filter(payment => payment.userId === userId))
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
