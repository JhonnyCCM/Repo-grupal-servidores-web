import { AppDataSource } from '../../presentation/data-source'
import { Routine } from '../../domain/models/routine.model'
import { DifficultyLevel } from '../../domain/value-objects'

export class RoutineService {
    private routineRepository = AppDataSource.getRepository(Routine)

    async createRoutine(routineData: Partial<Routine>): Promise<Routine> {
        if (!routineData.name || !routineData.machineId || !routineData.difficulty) {
            throw new Error('Routine name, machine ID, and difficulty are required')
        }

        const routine = this.routineRepository.create({
            ...routineData,
            exercises: routineData.exercises || [],
            animationsUrls: routineData.animationsUrls || []
        })
        return await this.routineRepository.save(routine)
    }

    async updateRoutine(id: string, routineData: Partial<Routine>): Promise<Routine | null> {
        await this.routineRepository.update(id, routineData)
        return this.getRoutineById(id)
    }

    async getRoutineById(id: string): Promise<Routine | null> {
        return await this.routineRepository.findOne({
            where: { id }
        })
    }

    async getRoutinesByMachineId(machineId: string): Promise<Routine[]> {
        return await this.routineRepository.find({
            where: { machineId },
            order: { createdAt: 'DESC' }
        })
    }

    async getRoutinesByDifficulty(difficulty: DifficultyLevel): Promise<Routine[]> {
        return await this.routineRepository.find({
            where: { difficulty },
            order: { createdAt: 'DESC' }
        })
    }

    async getBeginnerRoutines(): Promise<Routine[]> {
        return await this.getRoutinesByDifficulty(DifficultyLevel.BEGINNER)
    }

    async getIntermediateRoutines(): Promise<Routine[]> {
        return await this.getRoutinesByDifficulty(DifficultyLevel.INTERMEDIATE)
    }

    async getAdvancedRoutines(): Promise<Routine[]> {
        return await this.getRoutinesByDifficulty(DifficultyLevel.ADVANCED)
    }

    async searchRoutines(searchTerm: string): Promise<Routine[]> {
        return await this.routineRepository
            .createQueryBuilder('routine')
            .where('routine.name ILIKE :searchTerm OR routine.description ILIKE :searchTerm')
            .setParameter('searchTerm', `%${searchTerm}%`)
            .orderBy('routine.createdAt', 'DESC')
            .getMany()
    }

    async getRoutinesWithAnimations(): Promise<Routine[]> {
        return await this.routineRepository
            .createQueryBuilder('routine')
            .where('routine.animationsUrls IS NOT NULL')
            .getMany()
    }

    async addAnimationToRoutine(routineId: string, animationUrl: string): Promise<boolean> {
        const routine = await this.getRoutineById(routineId)
        if (!routine) {
            throw new Error('Routine not found')
        }

        const animationsUrls = routine.animationsUrls || []
        if (animationsUrls.includes(animationUrl)) {
            throw new Error('Animation URL already exists in routine')
        }

        animationsUrls.push(animationUrl)
        await this.routineRepository.update(routineId, { animationsUrls })
        return true
    }

    async removeAnimationFromRoutine(routineId: string, animationUrl: string): Promise<boolean> {
        const routine = await this.getRoutineById(routineId)
        if (!routine) {
            throw new Error('Routine not found')
        }

        const animationsUrls = routine.animationsUrls || []
        const updatedAnimationUrls = animationsUrls.filter(url => url !== animationUrl)
        
        await this.routineRepository.update(routineId, { animationsUrls: updatedAnimationUrls })
        return true
    }

    async addExerciseToRoutine(routineId: string, exercise: string): Promise<boolean> {
        const routine = await this.getRoutineById(routineId)
        if (!routine) {
            throw new Error('Routine not found')
        }

        const exercises = routine.exercises || []
        if (exercises.includes(exercise)) {
            throw new Error('Exercise already exists in routine')
        }

        exercises.push(exercise)
        await this.routineRepository.update(routineId, { exercises })
        return true
    }

    async removeExerciseFromRoutine(routineId: string, exercise: string): Promise<boolean> {
        const routine = await this.getRoutineById(routineId)
        if (!routine) {
            throw new Error('Routine not found')
        }

        const exercises = routine.exercises || []
        const updatedExercises = exercises.filter(ex => ex !== exercise)
        
        await this.routineRepository.update(routineId, { exercises: updatedExercises })
        return true
    }

    async getAllRoutines(): Promise<Routine[]> {
        return await this.routineRepository.find({
            order: { createdAt: 'DESC' }
        })
    }

    async deleteRoutine(id: string): Promise<boolean> {
        const result = await this.routineRepository.delete(id)
        return result.affected ? result.affected > 0 : false
    }
}