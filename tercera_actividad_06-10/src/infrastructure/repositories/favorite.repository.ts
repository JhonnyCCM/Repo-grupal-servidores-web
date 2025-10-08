import { FavoriteRepository } from "../../domain/repositories/favorite.repository"
import { Favorite } from "../../domain/models/favorite.model"
import { v4 as uuidv4 } from 'uuid'

export class InMemoryFavoriteRepository implements FavoriteRepository {
    private favorites: Favorite[] = []

    async create(favoriteData: Partial<Favorite>): Promise<Favorite> {
        await new Promise(resolve => setTimeout(resolve, 500)) // Simula delay de BD
        
        const favorite: Favorite = {
            id: uuidv4(),
            userId: favoriteData.userId!,
            entityType: favoriteData.entityType!,
            entityId: favoriteData.entityId!,
            createdAt: new Date(),
            user: favoriteData.user!
        }
        
        this.favorites.push(favorite)
        return favorite
    }

    async update(id: string, favoriteData: Partial<Favorite>): Promise<Favorite | null> {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const index = this.favorites.findIndex(f => f.id === id)
        if (index === -1) return null
        
        this.favorites[index] = { ...this.favorites[index], ...favoriteData }
        return this.favorites[index]
    }

    async findById(id: string): Promise<Favorite | null> {
        await new Promise(resolve => setTimeout(resolve, 500))
        return this.favorites.find(f => f.id === id) || null
    }

    async findAll(): Promise<Favorite[]> {
        await new Promise(resolve => setTimeout(resolve, 500))
        return [...this.favorites]
    }

    async delete(id: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const initialLength = this.favorites.length
        this.favorites = this.favorites.filter(f => f.id !== id)
        return this.favorites.length < initialLength
    }

    async findByUserId(userId: string): Promise<Favorite[]> {
        await new Promise(resolve => setTimeout(resolve, 500))
        return this.favorites.filter(f => f.userId === userId)
    }

    async findByUserIdAndEntityType(userId: string, entityType: "machine" | "gymClass" | "coach"): Promise<Favorite[]> {
        await new Promise(resolve => setTimeout(resolve, 500))
        return this.favorites.filter(f => f.userId === userId && f.entityType === entityType)
    }

    async findByEntityTypeAndEntityId(entityType: "machine" | "gymClass" | "coach", entityId: string): Promise<Favorite[]> {
        await new Promise(resolve => setTimeout(resolve, 500))
        return this.favorites.filter(f => f.entityType === entityType && f.entityId === entityId)
    }

    async existsByUserIdAndEntity(userId: string, entityType: "machine" | "gymClass" | "coach", entityId: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 500))
        return this.favorites.some(f => 
            f.userId === userId && 
            f.entityType === entityType && 
            f.entityId === entityId
        )
    }

    async deleteByUserIdAndEntity(userId: string, entityType: "machine" | "gymClass" | "coach", entityId: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const initialLength = this.favorites.length
        this.favorites = this.favorites.filter(f => 
            !(f.userId === userId && f.entityType === entityType && f.entityId === entityId)
        )
        return this.favorites.length < initialLength
    }
}