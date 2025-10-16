import { User } from "../../domain/entities/user.entity.js";
import type { UserRepository } from "../../domain/repositories/user.repository.js";

export class UserService {
    constructor(private readonly userRepository: UserRepository) {}
    createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">, callback: (error: Error | null, result?: string) => void): void {
        if (!user.fullName || !user.email || !user.password) {
            return callback(new Error("Full name, email, and password are required"));
        }
        this.userRepository.create(user, callback);
    }
    updateUser(id: string, user: Partial<User>): Promise<User | null> {
        return this.userRepository.update(id, user);
    }
    getUserById(id: string): Promise<User | null> {
        return this.userRepository.getById(id);
    }
    getUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.getByEmail(email);
    }
    getAllUsers(): Promise<User[]> {
        return this.userRepository.getAll();
    }
    deleteUser(id: string): Promise<boolean> {
        return this.userRepository.delete(id);
    }
}