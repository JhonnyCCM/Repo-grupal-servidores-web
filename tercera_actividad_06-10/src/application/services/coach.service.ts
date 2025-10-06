import { AppDataSource } from '../../presentation/data-source';
import { CoachModel } from '../../domain/models/coach.model';

export class CoachService {
    private coachRepository = AppDataSource.getRepository(CoachModel);

    async createCoach(coachData: Partial<CoachModel>): Promise<CoachModel> {
        if (!coachData.fullName || !coachData.email) {
            throw new Error('Full name and email are required');
        }
        const coach = this.coachRepository.create(coachData);
        return await this.coachRepository.save(coach);
    }

    async updateCoach(id: number, coachData: Partial<CoachModel>): Promise<CoachModel | null> {
        await this.coachRepository.update(id, coachData);
        return this.getCoachById(id);
    }

    async getCoachById(id: number): Promise<CoachModel | null> {
        return await this.coachRepository.findOne({
            where: { id },
            relations: ['classes']
        });
    }

    async getAllCoaches(): Promise<CoachModel[]> {
        return await this.coachRepository.find({
            relations: ['classes']
        });
    }

    async deleteCoach(id: number): Promise<boolean> {
        const result = await this.coachRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
