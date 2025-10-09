import { AppDataSource } from '../../presentation/data-source'
import { GymClass } from '../../domain/models/gym-class.model'
import { DifficultyLevel } from '../../domain/value-objects'
import { User } from '../../domain/models/user.model'

export class GymClassService {
    private gymClassRepository = AppDataSource.getRepository(GymClass)
    private userRepository = AppDataSource.getRepository(User)

    async createGymClass(classData: Partial<GymClass>): Promise<GymClass> {
        if (!classData.name || !classData.coachId || !classData.capacity) {
            throw new Error('Class name, coach ID, and capacity are required')
        }
        const gymClass = this.gymClassRepository.create({
            ...classData,
            isActive: classData.isActive ?? true
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
            relations: ['coach', 'enrolledMembers']
        })
    }

    async getClassesByCoach(coachId: string): Promise<GymClass[]> {
        return await this.gymClassRepository.find({
            where: { coachId },
            relations: ['coach', 'enrolledMembers']
        })
    }

    async getActiveClasses(): Promise<GymClass[]> {
        return await this.gymClassRepository.find({
            where: { isActive: true },
            relations: ['coach', 'enrolledMembers']
        })
    }

    async getClassesByDifficulty(difficulty: DifficultyLevel): Promise<GymClass[]> {
        return await this.gymClassRepository.find({
            where: { difficultyLevel: difficulty },
            relations: ['coach', 'enrolledMembers']
        })
    }

    async enrollMember(classId: string, userId: string): Promise<boolean> {
        const gymClass = await this.getGymClassById(classId)
        if (!gymClass) {
            throw new Error('Class not found')
        }

        const user = await this.userRepository.findOne({ where: { id: userId } })
        if (!user) {
            throw new Error('User not found')
        }

        if (gymClass.enrolledMembers.length >= gymClass.capacity) {
            throw new Error('Class is full')
        }

        if (gymClass.enrolledMembers.some(member => member.id === userId)) {
            throw new Error('User already enrolled in this class')
        }

        gymClass.enrolledMembers.push(user)
        await this.gymClassRepository.save(gymClass)
        return true
    }

    async getAllGymClasses(): Promise<GymClass[]> {
        return await this.gymClassRepository.find({
            relations: ['coach', 'enrolledMembers']
        })
    }

    async deleteGymClass(id: string): Promise<boolean> {
        const result = await this.gymClassRepository.delete(id)
        return result.affected ? result.affected > 0 : false
    }
}