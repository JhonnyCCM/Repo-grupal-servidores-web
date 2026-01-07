import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clase } from './entities/clase.entity';

@Injectable()
export class ClasesService {
  private readonly logger = new Logger(ClasesService.name);

  constructor(
    @InjectRepository(Clase)
    private readonly claseRepository: Repository<Clase>,
  ) {}

  async create(data: Partial<Clase>): Promise<Clase> {
    this.logger.log(`Creating class: ${data.nombre}`);
    
    const clase = this.claseRepository.create(data);
    const saved = await this.claseRepository.save(clase);
    
    this.logger.log(`✅ Class created with ID: ${saved.id}`);
    return saved;
  }

  async findAll(): Promise<Clase[]> {
    return this.claseRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Clase> {
    return this.claseRepository.findOne({ where: { id } });
  }

  async updateQuota(id: number, newQuota: number): Promise<Clase> {
    this.logger.log(`Updating quota for class ${id}: ${newQuota}`);
    
    await this.claseRepository.update(id, { cupo: newQuota });
    const updated = await this.findOne(id);
    
    this.logger.log(`✅ Quota updated for class ${id}`);
    return updated;
  }

  async decrementQuota(id: number): Promise<Clase> {
    const clase = await this.findOne(id);
    
    if (!clase) {
      throw new Error(`Class ${id} not found`);
    }

    if (clase.cupo <= 0) {
      throw new Error(`No available spots for class ${id}`);
    }

    return this.updateQuota(id, clase.cupo - 1);
  }
}
