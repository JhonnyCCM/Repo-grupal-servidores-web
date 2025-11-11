import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError } from 'rxjs';
import { Category } from 'src/types/category.type';
import { CategoryStats, StatsFilterInput } from 'src/types/stats.type';
import { CreateCategoryInput, UpdateCategoryInput, FilterCategoryInput } from 'src/inputs/category.input';

@Injectable()
export class CategoryHttpService {
  private readonly restUrl = 'http://localhost:3001/categories';

  constructor(private readonly httpService: HttpService) {}

  findAll(filter?: FilterCategoryInput): Observable<Category[]> {
    let url = this.restUrl;
    const params = new URLSearchParams();
    
    // Solo usar búsqueda por texto si está disponible
    if (filter?.searchText) {
      params.append('search', filter.searchText);
    } else if (filter?.nameFilter?.value) {
      params.append('search', filter.nameFilter.value);
    } else if (filter?.name) {
      params.append('search', filter.name);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.httpService.get<Category[]>(url).pipe(
      map(response => {
        let categories = response.data;
        
        // ========== APLICAR FILTROS EN EL LADO CLIENT ==========
        
        // Filtro de fecha createdAt
        if (filter?.createdAtFilter) {
          const createdAtFilter = filter.createdAtFilter;
          categories = categories.filter(cat => {
            if (!cat.createdAt) return false;
            const catDate = new Date(cat.createdAt);
            const filterDate = new Date(createdAtFilter.value);
            
            switch (createdAtFilter.operator) {
              case 'between':
                if (!createdAtFilter.endValue) return false;
                const endDate = new Date(createdAtFilter.endValue);
                return catDate >= filterDate && catDate <= endDate;
              case 'gt':
                return catDate > filterDate;
              case 'gte':
                return catDate >= filterDate;
              case 'lt':
                return catDate < filterDate;
              case 'lte':
                return catDate <= filterDate;
              case 'equals':
                return catDate.toDateString() === filterDate.toDateString();
              default:
                return true;
            }
          });
        }

        // Filtro de descripción
        if (filter?.hasDescription !== undefined) {
          categories = categories.filter(cat => {
            const hasDesc = cat.description && cat.description.trim() !== '';
            return filter.hasDescription ? hasDesc : !hasDesc;
          });
        }

        // Filtro por lista de IDs incluidos
        if (filter?.includeIds && filter.includeIds.length > 0) {
          const includeIds = filter.includeIds;
          categories = categories.filter(cat => includeIds.includes(cat.id));
        }

        // Filtro por lista de IDs excluidos
        if (filter?.excludeIds && filter.excludeIds.length > 0) {
          const excludeIds = filter.excludeIds;
          categories = categories.filter(cat => !excludeIds.includes(cat.id));
        }

        // Filtro avanzado de nombre
        if (filter?.nameFilter && !filter.searchText) {
          const nameFilter = filter.nameFilter;
          categories = categories.filter(cat => {
            if (!cat.name) return false;
            const name = nameFilter.caseSensitive ? cat.name : cat.name.toLowerCase();
            const value = nameFilter.caseSensitive ? nameFilter.value : nameFilter.value.toLowerCase();
            
            switch (nameFilter.operator) {
              case 'contains':
                return name.includes(value);
              case 'starts_with':
                return name.startsWith(value);
              case 'ends_with':
                return name.endsWith(value);
              case 'equals':
                return name === value;
              case 'not_equals':
                return name !== value;
              default:
                return name.includes(value);
            }
          });
        }

        // Filtro avanzado de descripción
        if (filter?.descriptionFilter) {
          const descriptionFilter = filter.descriptionFilter;
          categories = categories.filter(cat => {
            if (!cat.description) return false;
            const desc = descriptionFilter.caseSensitive ? cat.description : cat.description.toLowerCase();
            const value = descriptionFilter.caseSensitive ? descriptionFilter.value : descriptionFilter.value.toLowerCase();
            
            switch (descriptionFilter.operator) {
              case 'contains':
                return desc.includes(value);
              case 'starts_with':
                return desc.startsWith(value);
              case 'ends_with':
                return desc.endsWith(value);
              case 'equals':
                return desc === value;
              default:
                return desc.includes(value);
            }
          });
        }

        // ========== ORDENAMIENTO ==========
        if (filter?.sort && filter.sort.length > 0) {
          const sortRules = filter.sort;
          categories.sort((a, b) => {
            for (const sortRule of sortRules) {
              let aVal: any, bVal: any;
              
              switch (sortRule.field) {
                case 'name':
                  aVal = a.name || '';
                  bVal = b.name || '';
                  break;
                case 'description':
                  aVal = a.description || '';
                  bVal = b.description || '';
                  break;
                case 'createdAt':
                  aVal = new Date(a.createdAt || 0);
                  bVal = new Date(b.createdAt || 0);
                  break;
                case 'updatedAt':
                  aVal = new Date(a.updatedAt || 0);
                  bVal = new Date(b.updatedAt || 0);
                  break;
                case 'id':
                default:
                  aVal = a.id || '';
                  bVal = b.id || '';
                  break;
              }

              if (aVal < bVal) {
                return sortRule.order === 'ASC' ? -1 : 1;
              }
              if (aVal > bVal) {
                return sortRule.order === 'ASC' ? 1 : -1;
              }
              // Si son iguales, continuar con el siguiente criterio de ordenamiento
            }
            return 0;
          });
        }

        // ========== PAGINACIÓN ==========
        if (filter?.pagination) {
          const skip = filter.pagination.skip || 0;
          const take = filter.pagination.take || categories.length;
          categories = categories.slice(skip, skip + take);
        }

        return categories;
      }),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching categories',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  count(filter?: FilterCategoryInput): Observable<number> {
    // En lugar de llamar al endpoint /count que requiere UUID,
    // obtenemos todas las categorías y las contamos en memoria después de filtrar
    return this.findAll(filter).pipe(
      map(categories => categories.length),
      catchError(error => {
        throw new HttpException(
          'Error counting categories',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  private buildFilterParams(filter?: FilterCategoryInput): URLSearchParams {
    const params = new URLSearchParams();
    
    if (!filter) return params;

    // ========== FILTROS BÁSICOS COMPATIBLES ==========
    if (filter.id) params.append('id', filter.id);
    if (filter.name) params.append('name', filter.name);
    if (filter.description) params.append('description', filter.description);

    // ========== FILTROS AVANZADOS CONVERTIDOS A BÁSICOS ==========
    
    // Convertir nameFilter a búsqueda simple
    if (filter.nameFilter) {
      switch (filter.nameFilter.operator) {
        case 'contains':
          params.append('name_like', filter.nameFilter.value);
          break;
        case 'starts_with':
          params.append('name_like', `^${filter.nameFilter.value}`);
          break;
        case 'ends_with':
          params.append('name_like', `${filter.nameFilter.value}$`);
          break;
        case 'equals':
          params.append('name', filter.nameFilter.value);
          break;
        case 'not_equals':
          params.append('name_ne', filter.nameFilter.value);
          break;
        default:
          // Fallback a búsqueda simple
          params.append('name_like', filter.nameFilter.value);
      }
    }

    // Convertir descriptionFilter a búsqueda simple
    if (filter.descriptionFilter) {
      switch (filter.descriptionFilter.operator) {
        case 'contains':
          params.append('description_like', filter.descriptionFilter.value);
          break;
        case 'starts_with':
          params.append('description_like', `^${filter.descriptionFilter.value}`);
          break;
        case 'ends_with':
          params.append('description_like', `${filter.descriptionFilter.value}$`);
          break;
        case 'equals':
          params.append('description', filter.descriptionFilter.value);
          break;
        default:
          params.append('description_like', filter.descriptionFilter.value);
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

    // ========== BÚSQUEDA DE TEXTO LIBRE ==========
    if (filter.searchText) {
      // Usar 'q' para búsqueda general (común en APIs REST)
      params.append('q', filter.searchText);
    }

    // ========== FILTROS DE EXISTENCIA ==========
    if (filter.hasDescription !== undefined) {
      if (filter.hasDescription) {
        // Buscar registros donde description no esté vacío
        params.append('description_ne', '');
        params.append('description_ne', 'null');
      } else {
        // Buscar registros donde description esté vacío o sea null
        params.append('description', '');
      }
    }

    // ========== LISTAS DE INCLUSIÓN/EXCLUSIÓN ==========
    if (filter.includeIds && filter.includeIds.length > 0) {
      // Usar 'id_in' para múltiples IDs
      params.append('id_in', filter.includeIds.join(','));
    }
    
    if (filter.excludeIds && filter.excludeIds.length > 0) {
      // Usar 'id_nin' (not in) para excluir IDs
      params.append('id_nin', filter.excludeIds.join(','));
    }

    // ========== ORDENAMIENTO SIMPLIFICADO ==========
    if (filter.sort && filter.sort.length > 0) {
      // Tomar solo el primer ordenamiento (muchas APIs REST solo soportan uno)
      const primarySort = filter.sort[0];
      let sortField = '';
      
      switch (primarySort.field) {
        case 'name':
          sortField = 'name';
          break;
        case 'description':
          sortField = 'description';
          break;
        case 'createdAt':
          sortField = 'createdAt';
          break;
        case 'updatedAt':
          sortField = 'updatedAt';
          break;
        case 'id':
          sortField = 'id';
          break;
        default:
          sortField = 'id';
      }

      // Formato común: _sort=field&_order=asc|desc
      params.append('_sort', sortField);
      params.append('_order', primarySort.order.toLowerCase());
    }

    // ========== PAGINACIÓN SIMPLIFICADA ==========
    if (filter.pagination) {
      if (filter.pagination.skip !== undefined) {
        // Usar '_start' en lugar de 'skip'
        params.append('_start', filter.pagination.skip.toString());
      }
      if (filter.pagination.take !== undefined) {
        // Usar '_limit' en lugar de 'take'
        params.append('_limit', filter.pagination.take.toString());
      }
    }

    // ========== FALLBACKS PARA COMPATIBILIDAD ==========
    
    // Si no hay filtros específicos pero hay filtros básicos, usar formato alternativo
    if (!params.has('name') && !params.has('name_like') && filter.name) {
      params.append('name_contains', filter.name);
    }
    
    if (!params.has('description') && !params.has('description_like') && filter.description) {
      params.append('description_contains', filter.description);
    }

    return params;
  }

  findOne(id: string): Observable<Category> {
    return this.httpService.get<Category>(`${this.restUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Category not found',
          error.response?.status || HttpStatus.NOT_FOUND,
        );
      }),
    );
  }

  create(createCategoryInput: CreateCategoryInput): Observable<Category> {
    return this.httpService.post<Category>(this.restUrl, createCategoryInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error creating category',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  update(id: string, updateCategoryInput: UpdateCategoryInput): Observable<Category> {
    return this.httpService.put<Category>(`${this.restUrl}/${id}`, updateCategoryInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error updating category',
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
          error.response?.data?.message || 'Error deleting category',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  getStatistics(filter?: StatsFilterInput): Observable<CategoryStats> {
    // En lugar de llamar al endpoint /statistics que no está implementado,
    // obtenemos todas las categorías y calculamos las estadísticas en memoria
    return this.findAll().pipe(
      map(categories => {
        // Filtrar por fechas si se especifican
        let filteredCategories = categories;
        
        if (filter?.dateFrom || filter?.dateTo) {
          filteredCategories = categories.filter(category => {
            if (!category.createdAt) return true; // Si no hay fecha, incluir
            
            const createdAt = new Date(category.createdAt);
            
            if (filter.dateFrom) {
              const dateFrom = new Date(filter.dateFrom);
              if (createdAt < dateFrom) return false;
            }
            
            if (filter.dateTo) {
              const dateTo = new Date(filter.dateTo);
              if (createdAt > dateTo) return false;
            }
            
            return true;
          });
        }

        // Calcular estadísticas
        const totalCategories = filteredCategories.length;
        const categoriesWithDescription = filteredCategories.filter(cat => 
          cat.description && cat.description.trim().length > 0
        ).length;
        const categoriesWithoutDescription = totalCategories - categoriesWithDescription;
        
        const descriptionsLengths = filteredCategories
          .filter(cat => cat.description && cat.description.trim().length > 0)
          .map(cat => cat.description!.length); // ! porque ya filtramos que no sea undefined
        
        const averageDescriptionLength = descriptionsLengths.length > 0 
          ? descriptionsLengths.reduce((sum, length) => sum + length, 0) / descriptionsLengths.length 
          : 0;

        return {
          totalCategories,
          categoriesWithDescription,
          categoriesWithoutDescription,
          averageDescriptionLength: Math.round(averageDescriptionLength * 100) / 100,
          categoriesByDate: [], // Podría implementarse si se necesita
          mostUsedCategories: [] // Podría implementarse si se necesita
        };
      }),
      catchError(error => {
        throw new HttpException(
          'Error calculating category statistics',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  getPopularCategories(limit?: number): Observable<Category[]> {
    let url = `${this.restUrl}/popular`;
    if (limit) {
      url += `?limit=${limit}`;
    }

    return this.httpService.get<Category[]>(url).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching popular categories',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}