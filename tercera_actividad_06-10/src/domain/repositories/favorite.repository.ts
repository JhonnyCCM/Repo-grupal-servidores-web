import { Favorite } from "../models/favorite.model"

export interface FavoriteRepository {
    create(favorite: Partial<Favorite>): Promise<Favorite>
    update(id: string, favorite: Partial<Favorite>): Promise<Favorite | null>
    findById(id: string): Promise<Favorite | null>
    findAll(): Promise<Favorite[]>
    delete(id: string): Promise<boolean>
    findByUserId(userId: string): Promise<Favorite[]>
    findByUserIdAndEntityType(userId: string, entityType: "machine" | "gymClass" | "coach"): Promise<Favorite[]>
    findByEntityTypeAndEntityId(entityType: "machine" | "gymClass" | "coach", entityId: string): Promise<Favorite[]>
    existsByUserIdAndEntity(userId: string, entityType: "machine" | "gymClass" | "coach", entityId: string): Promise<boolean>
    deleteByUserIdAndEntity(userId: string, entityType: "machine" | "gymClass" | "coach", entityId: string): Promise<boolean>
}
