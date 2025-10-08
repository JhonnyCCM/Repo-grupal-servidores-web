import { AppDataSource } from '../../presentation/data-source'
import { GymClass } from '../../domain/models/gym-class.model'
import { DifficultyLevel } from '../../domain/value-objects'

export class GymClassService {
    private gymClassRepository = AppDataSource.getRepository(GymClass)

    async createGymClass(classData: Partial<GymClass>): Promise<GymClass> {
        if (!classData.name || !classData.coachId || !classData.capacity) {
            throw new Error('Class name, coach ID, and capacity are required')
        }
        const gymClass = this.gymClassRepository.create({
            ...classData,
            isActive: classData.isActive ?? true,
            enrolledMemberIds: []
        })
        return await this.gymClassRepository.save(gymClass)
    }

    async updateGymClass(id: string, classData: Partial<GymClass>): Promise<GymClass | null> {
        await this.gymClassRepository.update(id, classData)
        return this.getGymClassById(id)
    }

    async getGymClassById(id: string): Promise<GymClass | null> {
        return await this.gymClassRepository.findOne({
            where: { id },
            relations: ['coach']
        })
    }

    async getClassesByCoach(coachId: string): Promise<GymClass[]> {
        return await this.gymClassRepository.find({
            where: { coachId },
            relations: ['coach']
        })
    }

    async getActiveClasses(): Promise<GymClass[]> {
        return await this.gymClassRepository.find({
            where: { isActive: true },
            relations: ['coach']
        })
    }

    async getClassesByDifficulty(difficulty: DifficultyLevel): Promise<GymClass[]> {
        return await this.gymClassRepository.find({
            where: { difficultyLevel: difficulty },
            relations: ['coach']
        })
    }

    async enrollMember(classId: string, userId: string): Promise<boolean> {
        const gymClass = await this.getGymClassById(classId)
        if (!gymClass) {
            throw new Error('Class not found')
        }
        
        const enrolledIds = gymClass.enrolledMemberIds || []
        if (enrolledIds.includes(userId)) {
            throw new Error('User already enrolled in this class')
        }
        
        if (enrolledIds.length >= gymClass.capacity) {
            throw new Error('Class is full')
        }
        
        enrolledIds.push(userId)
        await this.gymClassRepository.update(classId, { enrolledMemberIds: enrolledIds })
        return true
    }

    async getAllGymClasses(): Promise<GymClass[]> {
        return await this.gymClassRepository.find({
            relations: ['coach']
        })
    }

    async deleteGymClass(id: string): Promise<boolean> {
        const result = await this.gymClassRepository.delete(id)
        return result.affected ? result.affected > 0 : false
    }
}
