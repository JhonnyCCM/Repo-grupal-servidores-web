import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError } from 'rxjs';
import { Plan } from '../types/plan.type';
import { CreatePlanInput, UpdatePlanInput, FilterPlanInput } from '../inputs/plan.input';

@Injectable()
export class PlanHttpService {
  private readonly restUrl = 'http://localhost:3001/plans';

  constructor(private readonly httpService: HttpService) {}

  findAll(filter?: FilterPlanInput): Observable<Plan[]> {
    return this.httpService.get<Plan[]>(this.restUrl).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching plans',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  findOne(id: string): Observable<Plan> {
    return this.httpService.get<Plan>(`${this.restUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Plan not found',
          error.response?.status || HttpStatus.NOT_FOUND,
        );
      }),
    );
  }

  create(createPlanInput: CreatePlanInput): Observable<Plan> {
    return this.httpService.post<Plan>(this.restUrl, createPlanInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error creating plan',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  update(id: string, updatePlanInput: UpdatePlanInput): Observable<Plan> {
    return this.httpService.patch<Plan>(`${this.restUrl}/${id}`, updatePlanInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error updating plan',
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
          error.response?.data?.message || 'Error deleting plan',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  // Consulta compleja: planes activos
  findActivePlans(): Observable<Plan[]> {
    return this.findAll().pipe(
      map(plans => plans.filter(plan => plan.isActive))
    );
  }

  // Consulta compleja: planes por rango de precio
  findByPriceRange(minPrice: number, maxPrice: number): Observable<Plan[]> {
    return this.findAll().pipe(
      map(plans => plans.filter(plan => 
        plan.price >= minPrice && plan.price <= maxPrice
      ))
    );
  }
}
