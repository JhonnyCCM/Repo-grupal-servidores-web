import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentStatus, PaymentMethod } from 'src/common/enums';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      const payment = this.paymentRepository.create({
        ...createPaymentDto,
        status: createPaymentDto.status || PaymentStatus.PENDING
      });
      return await this.paymentRepository.save(payment);
    } catch (error) {
      throw new BadRequestException('Error al crear el pago');
    }
  }

  async findAll(
    status?: PaymentStatus,
    method?: PaymentMethod,
    userId?: string
  ): Promise<Payment[]> {
    try {
      const queryBuilder = this.paymentRepository.createQueryBuilder('payment');

      if (status) {
        queryBuilder.where('payment.status = :status', { status });
      }

      if (method) {
        queryBuilder.andWhere('payment.method = :method', { method });
      }

      if (userId) {
        queryBuilder.andWhere('payment.userId = :userId', { userId });
      }

      queryBuilder.orderBy('payment.createdAt', 'DESC');
      return await queryBuilder.getMany();
    } catch (error) {
      throw new BadRequestException('Error al obtener los pagos');
    }
  }

  async findOne(id: string): Promise<Payment> {
    try {
      const payment = await this.paymentRepository.findOne({ where: { id } });
      
      if (!payment) {
        throw new NotFoundException(`Pago con ID ${id} no encontrado`);
      }

      return payment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener el pago');
    }
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    try {
      const payment = await this.findOne(id);
      
      // Si el estado cambia a COMPLETED, establecer la fecha de pago
      if (updatePaymentDto.status === PaymentStatus.COMPLETED && 
          payment.status !== PaymentStatus.COMPLETED) {
        updatePaymentDto.paidAt = new Date();
      }

      Object.assign(payment, updatePaymentDto);
      return await this.paymentRepository.save(payment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar el pago');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const payment = await this.findOne(id);
      await this.paymentRepository.remove(payment);
      return { message: `Pago con ID ${id} eliminado correctamente` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar el pago');
    }
  }

  async findByUser(userId: string): Promise<Payment[]> {
    try {
      return await this.paymentRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener pagos del usuario');
    }
  }

  async findByMembership(membershipId: string): Promise<Payment[]> {
    try {
      return await this.paymentRepository.find({
        where: { membershipId },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener pagos de la membresía');
    }
  }

  async findByStatus(status: PaymentStatus): Promise<Payment[]> {
    try {
      return await this.paymentRepository.find({
        where: { status },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener pagos por estado');
    }
  }

  async markAsCompleted(id: string): Promise<Payment> {
    try {
      const payment = await this.findOne(id);
      payment.status = PaymentStatus.COMPLETED;
      payment.paidAt = new Date();
      return await this.paymentRepository.save(payment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al marcar el pago como completado');
    }
  }

  async markAsFailed(id: string): Promise<Payment> {
    try {
      const payment = await this.findOne(id);
      payment.status = PaymentStatus.FAILED;
      return await this.paymentRepository.save(payment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al marcar el pago como fallido');
    }
  }

  async getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    try {
      return await this.paymentRepository.find({
        where: {
          createdAt: Between(startDate, endDate)
        },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener pagos por rango de fechas');
    }
  }
}
