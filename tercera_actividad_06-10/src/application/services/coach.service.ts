import { AppDataSource } from '../../presentation/data-source'
import { Coach } from '../../domain/models/coach.model'

export class CoachService {
    private coachRepository = AppDataSource.getRepository(Coach)

    async createCoach(coachData: Partial<Coach>): Promise<Coach> {
        if (!coachData.fullName || !coachData.email) {
            throw new Error('Full name and email are required')
        }
        
        const existingCoach = await this.coachRepository.findOne({
            where: { email: coachData.email }
        })
        if (existingCoach) {
            throw new Error('Email already exists')
        }

        const coach = this.coachRepository.create(coachData)
        return await this.coachRepository.save(coach)
    }

    async updateCoach(id: string, coachData: Partial<Coach>): Promise<Coach | null> {
        await this.coachRepository.update(id, coachData)
        return this.getCoachById(id)
    }

    async getCoachById(id: string): Promise<Coach | null> {
        return await this.coachRepository.findOne({
            where: { id },
            relations: ['classes']
        })
    }

    async getCoachByEmail(email: string): Promise<Coach | null> {
        return await this.coachRepository.findOne({
            where: { email }
        })
    }

    async getAllCoaches(): Promise<Coach[]> {
        return await this.coachRepository.find({
            relations: ['classes']
        })
    }

    async getActiveCoaches(): Promise<Coach[]> {
        return await this.coachRepository.find({
            where: { isActive: true },
            relations: ['classes']
        })
    }

    async deleteCoach(id: string): Promise<boolean> {
        const result = await this.coachRepository.delete(id)
        return result.affected ? result.affected > 0 : false
    }
}