import { AppDataSource } from '../../presentation/data-source'
import { Favorite } from '../../domain/models/favorite.model'

export class FavoriteService {
    private favoriteRepository = AppDataSource.getRepository(Favorite)

    async addFavorite(userId: string, entityType: 'machine' | 'gymClass' | 'coach', entityId: string): Promise<Favorite> {
        // Check if favorite already exists
        const existingFavorite = await this.favoriteRepository.findOne({
            where: { userId, entityType, entityId }
        })

        if (existingFavorite) {
            throw new Error('Item is already in favorites')
        }

        const favorite = this.favoriteRepository.create({
            userId,
            entityType,
            entityId
        })

        return await this.favoriteRepository.save(favorite)
    }

    async removeFavorite(userId: string, entityType: 'machine' | 'gymClass' | 'coach', entityId: string): Promise<boolean> {
        const result = await this.favoriteRepository.delete({
            userId,
            entityType,
            entityId
        })

        return result.affected ? result.affected > 0 : false
    }

    async getUserFavorites(userId: string): Promise<Favorite[]> {
        return await this.favoriteRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        })
    }

    async getUserFavoritesByType(userId: string, entityType: 'machine' | 'gymClass' | 'coach'): Promise<Favorite[]> {
        return await this.favoriteRepository.find({
            where: { userId, entityType },
            order: { createdAt: 'DESC' }
        })
    }

    async isInFavorites(userId: string, entityType: 'machine' | 'gymClass' | 'coach', entityId: string): Promise<boolean> {
        const favorite = await this.favoriteRepository.findOne({
            where: { userId, entityType, entityId }
        })

        return !!favorite
    }

    async getFavoritesByEntity(entityType: 'machine' | 'gymClass' | 'coach', entityId: string): Promise<Favorite[]> {
        return await this.favoriteRepository.find({
            where: { entityType, entityId },
            relations: ['user']
        })
    }

    async getFavoriteById(id: string): Promise<Favorite | null> {
        return await this.favoriteRepository.findOne({
            where: { id },
            relations: ['user']
        })
    }

    async getAllFavorites(): Promise<Favorite[]> {
        return await this.favoriteRepository.find({
            relations: ['user'],
            order: { createdAt: 'DESC' }
        })
    }

    async getUserFavoriteCoaches(userId: string): Promise<Favorite[]> {
        return await this.getUserFavoritesByType(userId, 'coach')
    }

    async getUserFavoriteMachines(userId: string): Promise<Favorite[]> {
        return await this.getUserFavoritesByType(userId, 'machine')
    }

    async getUserFavoriteClasses(userId: string): Promise<Favorite[]> {
        return await this.getUserFavoritesByType(userId, 'gymClass')
    }

    async toggleFavorite(userId: string, entityType: 'machine' | 'gymClass' | 'coach', entityId: string): Promise<{ action: 'added' | 'removed'; favorite?: Favorite }> {
        const isInFavorites = await this.isInFavorites(userId, entityType, entityId)

        if (isInFavorites) {
            await this.removeFavorite(userId, entityType, entityId)
            return { action: 'removed' }
        } else {
            const favorite = await this.addFavorite(userId, entityType, entityId)
            return { action: 'added', favorite }
        }
    }

    async clearUserFavorites(userId: string): Promise<boolean> {
        const result = await this.favoriteRepository.delete({ userId })
        return result.affected ? result.affected > 0 : false
    }

    async deleteFavorite(id: string): Promise<boolean> {
        const result = await this.favoriteRepository.delete(id)
        return result.affected ? result.affected > 0 : false
    }
}