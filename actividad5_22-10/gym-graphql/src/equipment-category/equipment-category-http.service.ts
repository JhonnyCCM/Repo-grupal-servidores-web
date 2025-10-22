import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError } from 'rxjs';
import { EquipmentCategory } from '../types/equipment_category.type';
import { CreateEquipmentCategoryInput, UpdateEquipmentCategoryInput, FilterEquipmentCategoryInput } from '../inputs/equipment-category.input';

@Injectable()
export class EquipmentCategoryHttpService {
  private readonly restUrl = 'http://localhost:3001/equipment-categories';

  constructor(private readonly httpService: HttpService) {}

  findAll(filter?: FilterEquipmentCategoryInput): Observable<EquipmentCategory[]> {
    let url = this.restUrl;
    const params = new URLSearchParams();
    
    if (filter?.equipmentId) params.append('equipmentId', filter.equipmentId);
    if (filter?.categoryId) params.append('categoryId', filter.categoryId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.httpService.get<EquipmentCategory[]>(url).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching equipment categories',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  findOne(id: string): Observable<EquipmentCategory> {
    return this.httpService.get<EquipmentCategory>(`${this.restUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Equipment category not found',
          error.response?.status || HttpStatus.NOT_FOUND,
        );
      }),
    );
  }

  create(createEquipmentCategoryInput: CreateEquipmentCategoryInput): Observable<EquipmentCategory> {
    return this.httpService.post<EquipmentCategory>(this.restUrl, createEquipmentCategoryInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error creating equipment category',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  update(id: string, updateEquipmentCategoryInput: UpdateEquipmentCategoryInput): Observable<EquipmentCategory> {
    return this.httpService.put<EquipmentCategory>(`${this.restUrl}/${id}`, updateEquipmentCategoryInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error updating equipment category',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  remove(id: string): Observable<{ message: string }> {
    return this.httpService.delete<{ message: string }>(`${this.restUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error deleting equipment category',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }
}