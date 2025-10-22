import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from 'src/common/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Verificar si el email ya existe
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email }
      });

      if (existingUser) {
        throw new ConflictException('Ya existe un usuario con este correo electrónico');
      }

      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener los usuarios');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id }
      });

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener el usuario');
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email }
      });

      if (!user) {
        throw new NotFoundException(`Usuario con email ${email} no encontrado`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener el usuario');
    }
  }

  async findActive(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        where: { isActive: true },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener los usuarios activos');
    }
  }

  async findByRole(role: UserRole): Promise<User[]> {
    try {
      return await this.userRepository.find({
        where: { role },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener los usuarios por rol');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOne(id);

      // Si se está actualizando el email, verificar que no esté en uso
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: updateUserDto.email }
        });

        if (existingUser) {
          throw new ConflictException('Ya existe un usuario con este correo electrónico');
        }
      }

      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar el usuario');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const user = await this.findOne(id);
      await this.userRepository.remove(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar el usuario');
    }
  }

  async softDelete(id: string): Promise<User> {
    try {
      const user = await this.findOne(id);
      user.isActive = false;
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al desactivar el usuario');
    }
  }

  async activate(id: string): Promise<User> {
    try {
      const user = await this.findOne(id);
      user.isActive = true;
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al activar el usuario');
    }
  }
}
