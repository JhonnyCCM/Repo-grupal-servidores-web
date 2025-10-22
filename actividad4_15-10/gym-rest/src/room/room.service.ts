import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      const room = this.roomRepository.create(createRoomDto);
      return await this.roomRepository.save(room);
    } catch (error) {
      throw new BadRequestException('Error al crear la sala');
    }
  }

  async findAll(
    search?: string,
    minCapacity?: number,
    maxCapacity?: number
  ): Promise<Room[]> {
    try {
      const queryBuilder = this.roomRepository.createQueryBuilder('room');

      if (search) {
        queryBuilder.where(
          '(room.name LIKE :search OR room.description LIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (minCapacity) {
        queryBuilder.andWhere('room.capacity >= :minCapacity', { minCapacity });
      }

      if (maxCapacity) {
        queryBuilder.andWhere('room.capacity <= :maxCapacity', { maxCapacity });
      }

      queryBuilder.orderBy('room.name', 'ASC');
      return await queryBuilder.getMany();
    } catch (error) {
      throw new BadRequestException('Error al obtener las salas');
    }
  }

  async findOne(id: string): Promise<Room> {
    try {
      const room = await this.roomRepository.findOne({ where: { id } });
      
      if (!room) {
        throw new NotFoundException(`Sala con ID ${id} no encontrada`);
      }

      return room;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener la sala');
    }
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    try {
      const room = await this.findOne(id);
      Object.assign(room, updateRoomDto);
      return await this.roomRepository.save(room);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar la sala');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const room = await this.findOne(id);
      await this.roomRepository.remove(room);
      return { message: `Sala con ID ${id} eliminada correctamente` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar la sala');
    }
  }

  async findByCapacityRange(minCapacity: number, maxCapacity: number): Promise<Room[]> {
    try {
      return await this.roomRepository.find({
        where: {
          capacity: MoreThanOrEqual(minCapacity) && LessThanOrEqual(maxCapacity)
        },
        order: { capacity: 'ASC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al buscar salas por capacidad');
    }
  }

  async findAvailableRooms(): Promise<Room[]> {
    try {
      return await this.roomRepository.find({
        order: { name: 'ASC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener salas disponibles');
    }
  }
}
