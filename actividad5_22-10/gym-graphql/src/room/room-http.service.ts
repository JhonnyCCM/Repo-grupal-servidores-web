import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, catchError } from 'rxjs';
import { Room } from '../types/room.type';
import { CreateRoomInput, UpdateRoomInput, FilterRoomInput } from '../inputs/room.input';

@Injectable()
export class RoomHttpService {
  private readonly restUrl = 'http://localhost:3001/rooms';

  constructor(private readonly httpService: HttpService) {}

  findAll(filter?: FilterRoomInput): Observable<Room[]> {
    return this.httpService.get<Room[]>(this.restUrl).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching rooms',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  findOne(id: string): Observable<Room> {
    return this.httpService.get<Room>(`${this.restUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Room not found',
          error.response?.status || HttpStatus.NOT_FOUND,
        );
      }),
    );
  }

  create(createRoomInput: CreateRoomInput): Observable<Room> {
    return this.httpService.post<Room>(this.restUrl, createRoomInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error creating room',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  update(id: string, updateRoomInput: UpdateRoomInput): Observable<Room> {
    return this.httpService.patch<Room>(`${this.restUrl}/${id}`, updateRoomInput).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error updating room',
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
          error.response?.data?.message || 'Error deleting room',
          error.response?.status || HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  // Consulta compleja: salas disponibles con capacidad mínima
  findAvailableRooms(minCapacity: number): Observable<Room[]> {
    return this.httpService.get(`${this.restUrl}/available?minCapacity=${minCapacity}`).pipe(
      map(response => response.data),
      catchError(error => {
        throw new HttpException(
          error.response?.data?.message || 'Error fetching available rooms',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}
