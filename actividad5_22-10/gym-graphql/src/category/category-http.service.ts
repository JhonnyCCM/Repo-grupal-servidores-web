import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError } from 'rxjs';
import { Category } from 'src/types/category.type';
import { CreateCategoryInput, UpdateCategoryInput, FilterCategoryInput } from 'src/inputs/category.input';

@Injectable()
export class CategoryHttpService {
  private readonly restUrl = 'http://localhost:3001/categories';

  constructor(private readonly httpService: HttpService) {}

  findAll(filter?: FilterCategoryInput): Observable<Category[]> {
    let url = this.restUrl;
    const params = new URLSearchParams();
    
    if (filter?.name) params.append('name', filter.name);
    if (filter?.description) params.append('description', filter.description);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.httpService.get<Category[]>(url).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching categories',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
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
}