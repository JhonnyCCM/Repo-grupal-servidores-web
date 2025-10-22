import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Room } from '../types/room.type';
import { CreateRoomInput, UpdateRoomInput, FilterRoomInput } from '../inputs/room.input';
import { RoomHttpService } from './room-http.service';
import { Observable } from 'rxjs';

@Resolver(() => Room)
export class RoomResolver {
  constructor(private readonly roomHttpService: RoomHttpService) {}

  @Query(() => [Room], { name: 'rooms' })
  findAll(@Args('filter', { type: () => FilterRoomInput, nullable: true }) filter?: FilterRoomInput): Observable<Room[]> {
    return this.roomHttpService.findAll(filter);
  }

  @Query(() => Room, { name: 'room' })
  findOne(@Args('id', { type: () => ID }) id: string): Observable<Room> {
    return this.roomHttpService.findOne(id);
  }

  @Mutation(() => Room)
  createRoom(@Args('createRoomInput') createRoomInput: CreateRoomInput): Observable<Room> {
    return this.roomHttpService.create(createRoomInput);
  }

  @Mutation(() => Room)
  updateRoom(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateRoomInput') updateRoomInput: UpdateRoomInput,
  ): Observable<Room> {
    return this.roomHttpService.update(id, updateRoomInput);
  }

  @Mutation(() => Boolean)
  removeRoom(@Args('id', { type: () => ID }) id: string): Observable<boolean> {
    return this.roomHttpService.remove(id);
  }

  // Consultas complejas
  @Query(() => [Room], { name: 'availableRooms' })
  getAvailableRooms(@Args('minCapacity', { type: () => Number, defaultValue: 1 }) minCapacity: number): Observable<Room[]> {
    return this.roomHttpService.findAvailableRooms(minCapacity);
  }
}
