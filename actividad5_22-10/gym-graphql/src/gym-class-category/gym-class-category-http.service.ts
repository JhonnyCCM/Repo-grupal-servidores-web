import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError } from 'rxjs';
import { GymClassCategory } from '../types/gym-class_category.type';
import { GymClassCategoryStats, StatsFilterInput } from '../types/stats.type';
import { CreateGymClassCategoryInput, UpdateGymClassCategoryInput, FilterGymClassCategoryInput } from '../inputs/gym-class-category.input';

@Injectable()
export class GymClassCategoryHttpService {
  private readonly restUrl = 'http://localhost:3001/gym-class-categories';

  constructor(private readonly httpService: HttpService) {}

  findAll(filter?: FilterGymClassCategoryInput): Observable<GymClassCategory[]> {
    let url = this.restUrl;
    const params = this.buildFilterParams(filter);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.httpService.get<GymClassCategory[]>(url).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching gym class categories',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  count(filter?: FilterGymClassCategoryInput): Observable<number> {
    let url = `${this.restUrl}/count`;
    const params = this.buildFilterParams(filter);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.httpService.get<{ count: number }>(url).pipe(
      map(response => response.data.count),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error counting gym class categories',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  getUniqueClassIds(filter?: FilterGymClassCategoryInput): Observable<string[]> {
    let url = `${this.restUrl}/unique-class-ids`;
    const params = this.buildFilterParams(filter);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.httpService.get<{ classIds: string[] }>(url).pipe(
      map(response => response.data.classIds),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching unique class IDs',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  getUniqueCategoryIds(filter?: FilterGymClassCategoryInput): Observable<string[]> {
    let url = `${this.restUrl}/unique-category-ids`;
    const params = this.buildFilterParams(filter);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.httpService.get<{ categoryIds: string[] }>(url).pipe(
      map(response => response.data.categoryIds),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching unique category IDs',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  private buildFilterParams(filter?: FilterGymClassCategoryInput): URLSearchParams {
    const params = new URLSearchParams();
    
    if (!filter) return params;

    // ========== FILTROS BÁSICOS COMPATIBLES ==========
    if (filter.id) params.append('id', filter.id);
    if (filter.classId) params.append('classId', filter.classId);
    if (filter.categoryId) params.append('categoryId', filter.categoryId);

    // ========== FILTROS AVANZADOS CONVERTIDOS A BÁSICOS ==========
    
    // Convertir classIdFilter a búsqueda simple
    if (filter.classIdFilter) {
      switch (filter.classIdFilter.operator) {
        case 'contains':
          params.append('classId_like', filter.classIdFilter.value);
          break;
        case 'starts_with':
          params.append('classId_like', `^${filter.classIdFilter.value}`);
          break;
        case 'ends_with':
          params.append('classId_like', `${filter.classIdFilter.value}$`);
          break;
        case 'equals':
          params.append('classId', filter.classIdFilter.value);
          break;
        case 'not_equals':
          params.append('classId_ne', filter.classIdFilter.value);
          break;
        default:
          params.append('classId_like', filter.classIdFilter.value);
      }
    }

    // Convertir categoryIdFilter a búsqueda simple
    if (filter.categoryIdFilter) {
      switch (filter.categoryIdFilter.operator) {
        case 'contains':
          params.append('categoryId_like', filter.categoryIdFilter.value);
          break;
        case 'starts_with':
          params.append('categoryId_like', `^${filter.categoryIdFilter.value}`);
          break;
        case 'ends_with':
          params.append('categoryId_like', `${filter.categoryIdFilter.value}$`);
          break;
        case 'equals':
          params.append('categoryId', filter.categoryIdFilter.value);
          break;
        default:
          params.append('categoryId_like', filter.categoryIdFilter.value);
      }
    }

    // ========== FILTROS DE FECHA SIMPLIFICADOS ==========
    
    // Convertir createdAtFilter a filtros simples de fecha
    if (filter.createdAtFilter) {
      switch (filter.createdAtFilter.operator) {
        case 'between':
          if (filter.createdAtFilter.value) {
            params.append('createdAt_gte', filter.createdAtFilter.value);
          }
          if (filter.createdAtFilter.endValue) {
            params.append('createdAt_lte', filter.createdAtFilter.endValue);
          }
          break;
        case 'gt':
          params.append('createdAt_gt', filter.createdAtFilter.value);
          break;
        case 'gte':
          params.append('createdAt_gte', filter.createdAtFilter.value);
          break;
        case 'lt':
          params.append('createdAt_lt', filter.createdAtFilter.value);
          break;
        case 'lte':
          params.append('createdAt_lte', filter.createdAtFilter.value);
          break;
        case 'equals':
          params.append('createdAt', filter.createdAtFilter.value);
          break;
        default:
          params.append('createdAt_gte', filter.createdAtFilter.value);
      }
    }

    // Convertir updatedAtFilter a filtros simples
    if (filter.updatedAtFilter) {
      switch (filter.updatedAtFilter.operator) {
        case 'between':
          if (filter.updatedAtFilter.value) {
            params.append('updatedAt_gte', filter.updatedAtFilter.value);
          }
          if (filter.updatedAtFilter.endValue) {
            params.append('updatedAt_lte', filter.updatedAtFilter.endValue);
          }
          break;
        case 'gt':
          params.append('updatedAt_gt', filter.updatedAtFilter.value);
          break;
        case 'gte':
          params.append('updatedAt_gte', filter.updatedAtFilter.value);
          break;
        case 'lt':
          params.append('updatedAt_lt', filter.updatedAtFilter.value);
          break;
        case 'lte':
          params.append('updatedAt_lte', filter.updatedAtFilter.value);
          break;
        case 'equals':
          params.append('updatedAt', filter.updatedAtFilter.value);
          break;
        default:
          params.append('updatedAt_gte', filter.updatedAtFilter.value);
      }
    }

    // ========== FILTROS DE RELACIONES MÚLTIPLES ==========
    if (filter.classIds && filter.classIds.length > 0) {
      params.append('classId_in', filter.classIds.join(','));
    }
    
    if (filter.categoryIds && filter.categoryIds.length > 0) {
      params.append('categoryId_in', filter.categoryIds.join(','));
    }

    // ========== FILTROS DE EXCLUSIÓN ==========
    if (filter.excludeClassIds && filter.excludeClassIds.length > 0) {
      params.append('classId_nin', filter.excludeClassIds.join(','));
    }
    
    if (filter.excludeCategoryIds && filter.excludeCategoryIds.length > 0) {
      params.append('categoryId_nin', filter.excludeCategoryIds.join(','));
    }

    if (filter.excludeIds && filter.excludeIds.length > 0) {
      params.append('id_nin', filter.excludeIds.join(','));
    }

    if (filter.includeIds && filter.includeIds.length > 0) {
      params.append('id_in', filter.includeIds.join(','));
    }

    // ========== FILTROS DE EXISTENCIA DE RELACIONES ==========
    if (filter.hasValidClass !== undefined) {
      // Esto podría requerir una implementación específica en el backend
      params.append('hasValidClass', filter.hasValidClass.toString());
    }
    
    if (filter.hasValidCategory !== undefined) {
      params.append('hasValidCategory', filter.hasValidCategory.toString());
    }

    // ========== ORDENAMIENTO SIMPLIFICADO ==========
    if (filter.sort && filter.sort.length > 0) {
      const primarySort = filter.sort[0];
      let sortField = '';
      
      switch (primarySort.field) {
        case 'id':
          sortField = 'id';
          break;
        case 'classId':
          sortField = 'classId';
          break;
        case 'categoryId':
          sortField = 'categoryId';
          break;
        case 'createdAt':
          sortField = 'createdAt';
          break;
        case 'updatedAt':
          sortField = 'updatedAt';
          break;
        default:
          sortField = 'id';
      }

      params.append('_sort', sortField);
      params.append('_order', primarySort.order.toLowerCase());
    }

    // ========== PAGINACIÓN SIMPLIFICADA ==========
    if (filter.pagination) {
      if (filter.pagination.skip !== undefined) {
        params.append('_start', filter.pagination.skip.toString());
      }
      if (filter.pagination.take !== undefined) {
        params.append('_limit', filter.pagination.take.toString());
      }
    }

    // ========== FILTROS DE FECHA DE RANGO ESPECÍFICO ==========
    if (filter.createdAfter) params.append('createdAt_gte', filter.createdAfter);
    if (filter.createdBefore) params.append('createdAt_lte', filter.createdBefore);
    if (filter.updatedAfter) params.append('updatedAt_gte', filter.updatedAfter);
    if (filter.updatedBefore) params.append('updatedAt_lte', filter.updatedBefore);

    // ========== FILTROS DE PATRONES ==========
    if (filter.categoryPattern) {
      params.append('categoryId_like', filter.categoryPattern);
    }
    
    if (filter.classPattern) {
      params.append('classId_like', filter.classPattern);
    }

    // ========== FALLBACKS PARA COMPATIBILIDAD ==========
    if (!params.has('classId') && !params.has('classId_like') && filter.classId) {
      params.append('classId_contains', filter.classId);
    }
    
    if (!params.has('categoryId') && !params.has('categoryId_like') && filter.categoryId) {
      params.append('categoryId_contains', filter.categoryId);
    }

    return params;
  }

  getStatistics(filter?: StatsFilterInput): Observable<GymClassCategoryStats> {
    let url = `${this.restUrl}/statistics`;
    const params = new URLSearchParams();
    
    if (filter?.dateFrom) params.append('dateFrom', filter.dateFrom);
    if (filter?.dateTo) params.append('dateTo', filter.dateTo);
    if (filter?.limit) params.append('limit', filter.limit.toString());
    if (filter?.includeEmpty !== undefined) params.append('includeEmpty', filter.includeEmpty.toString());
    if (filter?.groupByPeriod) params.append('groupByPeriod', filter.groupByPeriod);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.httpService.get<GymClassCategoryStats>(url).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching gym class category statistics',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  getMostActive(limit?: number): Observable<GymClassCategory[]> {
    let url = `${this.restUrl}/most-active`;
    if (limit) {
      url += `?limit=${limit}`;
    }

    return this.httpService.get<GymClassCategory[]>(url).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching most active associations',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  findOne(id: string): Observable<GymClassCategory> {
    return this.httpService.get<GymClassCategory>(`${this.restUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Gym class category not found',
          error.response?.status || HttpStatus.NOT_FOUND,
        );
      }),
    );
  }

  create(createGymClassCategoryInput: CreateGymClassCategoryInput): Observable<GymClassCategory> {
    return this.httpService.post<GymClassCategory>(this.restUrl, createGymClassCategoryInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error creating gym class category',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  update(id: string, updateGymClassCategoryInput: UpdateGymClassCategoryInput): Observable<GymClassCategory> {
    return this.httpService.put<GymClassCategory>(`${this.restUrl}/${id}`, updateGymClassCategoryInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error updating gym class category',
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
          error.response?.data?.message || 'Error deleting gym class category',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }
}