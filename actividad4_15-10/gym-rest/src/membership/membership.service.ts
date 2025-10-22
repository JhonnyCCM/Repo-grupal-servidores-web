import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './entities/membership.entity';
import { MembershipStatus } from 'src/common/enums';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
  ) {}

  async create(createMembershipDto: CreateMembershipDto): Promise<Membership> {
    try {
      const membership = this.membershipRepository.create({
        ...createMembershipDto,
        startDate: new Date(createMembershipDto.startDate),
        endDate: new Date(createMembershipDto.endDate),
      });
      return await this.membershipRepository.save(membership);
    } catch (error) {
      throw new BadRequestException('Error al crear la membresía');
    }
  }

  async findAll(): Promise<Membership[]> {
    try {
      return await this.membershipRepository.find({
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener las membresías');
    }
  }

  async findOne(id: string): Promise<Membership> {
    try {
      const membership = await this.membershipRepository.findOne({
        where: { id }
      });

      if (!membership) {
        throw new NotFoundException(`Membresía con ID ${id} no encontrada`);
      }

      return membership;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener la membresía');
    }
  }

  async findByUser(userId: string): Promise<Membership[]> {
    try {
      return await this.membershipRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener las membresías del usuario');
    }
  }

  async findByPlan(planId: string): Promise<Membership[]> {
    try {
      return await this.membershipRepository.find({
        where: { planId },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener las membresías del plan');
    }
  }

  async findByStatus(status: MembershipStatus): Promise<Membership[]> {
    try {
      return await this.membershipRepository.find({
        where: { status },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener las membresías por estado');
    }
  }

  async findActive(): Promise<Membership[]> {
    return this.findByStatus(MembershipStatus.ACTIVE);
  }

  async findExpired(): Promise<Membership[]> {
    return this.findByStatus(MembershipStatus.EXPIRED);
  }

  async findExpiring(days: number = 30): Promise<Membership[]> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      return await this.membershipRepository
        .createQueryBuilder('membership')
        .where('membership.endDate <= :futureDate', { futureDate })
        .andWhere('membership.endDate > :now', { now: new Date() })
        .andWhere('membership.status = :status', { status: MembershipStatus.ACTIVE })
        .orderBy('membership.endDate', 'ASC')
        .getMany();
    } catch (error) {
      throw new BadRequestException('Error al obtener las membresías próximas a expirar');
    }
  }

  async update(id: string, updateMembershipDto: UpdateMembershipDto): Promise<Membership> {
    try {
      const membership = await this.findOne(id);

      if (updateMembershipDto.startDate) {
        updateMembershipDto.startDate = new Date(updateMembershipDto.startDate) as any;
      }
      if (updateMembershipDto.endDate) {
        updateMembershipDto.endDate = new Date(updateMembershipDto.endDate) as any;
      }

      Object.assign(membership, updateMembershipDto);
      return await this.membershipRepository.save(membership);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar la membresía');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const membership = await this.findOne(id);
      await this.membershipRepository.remove(membership);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar la membresía');
    }
  }

  async expire(id: string): Promise<Membership> {
    try {
      const membership = await this.findOne(id);
      membership.status = MembershipStatus.EXPIRED;
      return await this.membershipRepository.save(membership);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al expirar la membresía');
    }
  }

  async activate(id: string): Promise<Membership> {
    try {
      const membership = await this.findOne(id);
      membership.status = MembershipStatus.ACTIVE;
      return await this.membershipRepository.save(membership);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al activar la membresía');
    }
  }
}
