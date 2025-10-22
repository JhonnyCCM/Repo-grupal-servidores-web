import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError } from 'rxjs';
import { Equipment } from '../types/equipment.type';
import { CreateEquipmentInput, UpdateEquipmentInput, FilterEquipmentInput } from '../inputs/equipment.input';

@Injectable()
export class EquipmentHttpService {
  private readonly restUrl = 'http://localhost:3001/equipments';

  constructor(private readonly httpService: HttpService) {}

  findAll(filter?: FilterEquipmentInput): Observable<Equipment[]> {
    let url = this.restUrl;
    const params = new URLSearchParams();
    
    if (filter?.status) params.append('status', filter.status);
    if (filter?.search) params.append('search', filter.search);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.httpService.get<Equipment[]>(url).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching equipment',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  findOne(id: string): Observable<Equipment> {
    return this.httpService.get<Equipment>(`${this.restUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Equipment not found',
          error.response?.status || HttpStatus.NOT_FOUND,
        );
      }),
    );
  }

  create(createEquipmentInput: CreateEquipmentInput): Observable<Equipment> {
    return this.httpService.post<Equipment>(this.restUrl, createEquipmentInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error creating equipment',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  update(id: string, updateEquipmentInput: UpdateEquipmentInput): Observable<Equipment> {
    return this.httpService.patch<Equipment>(`${this.restUrl}/${id}`, updateEquipmentInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error updating equipment',
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
          error.response?.data?.message || 'Error deleting equipment',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  // Consulta compleja: equipos por estado
  findByStatus(status: string): Observable<Equipment[]> {
    return this.httpService.get(`${this.restUrl}/status/${status}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching equipment by status',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  // Consulta compleja: equipos disponibles
  findAvailable(): Observable<Equipment[]> {
    return this.findAll({ status: 'ACTIVE' as any });
  }

  // Consulta compleja: estadísticas de equipos
  getEquipmentStats(): Observable<any> {
    return this.httpService.get(`${this.restUrl}/stats`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching equipment stats',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}