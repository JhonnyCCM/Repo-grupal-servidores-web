import { AppDataSource } from '../../presentation/data-source';
import { GymClassModel } from '../../domain/models/gym-class.model';

export class GymClassService {
    private gymClassRepository = AppDataSource.getRepository(GymClassModel);

    async createGymClass(classData: Partial<GymClassModel>): Promise<GymClassModel> {
        if (!classData.name) {
            throw new Error('Class name is required');
        }
        const gymClass = this.gymClassRepository.create(classData);
        return await this.gymClassRepository.save(gymClass);
    }

    async updateGymClass(id: number, classData: Partial<GymClassModel>): Promise<GymClassModel | null> {
        await this.gymClassRepository.update(id, classData);
        return this.getGymClassById(id);
    }

    async getGymClassById(id: number): Promise<GymClassModel | null> {
        return await this.gymClassRepository.findOne({
            where: { id },
            relations: ['coach']
        });
    }

    async getAllGymClasses(): Promise<GymClassModel[]> {
        return await this.gymClassRepository.find({
            relations: ['coach']
        });
    }

    async deleteGymClass(id: number): Promise<boolean> {
        const result = await this.gymClassRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
