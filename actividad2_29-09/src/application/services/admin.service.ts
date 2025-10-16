import { Admin } from "../../domain/entities/admin.entity.js";
import type { AdminRepository } from "../../domain/repositories/admin.repository.js";

export class AdminService {
    constructor(private readonly adminRepository: AdminRepository) {}
    createAdmin(admin: Omit<Admin, "id" | "createdAt" | "updatedAt">, callback: (error: Error | null, result?: string) => void): void {
        if (!admin.email || !admin.password) {
            return callback(new Error("Email, and password are required"));
        }
        this.adminRepository.create(admin, callback);
    }
    updateAdmin(id: string, admin: Partial<Admin>): Promise<Admin | null> {
        return this.adminRepository.update(id, admin);
    }
    getAdminById(id: string): Promise<Admin | null> {
        return this.adminRepository.getById(id);
    }
    getAdminByEmail(email: string): Promise<Admin | null> {
        return this.adminRepository.getByEmail(email);
    }
    getAllAdmins(): Promise<Admin[]> {
        return this.adminRepository.getAll();
    }
    deleteAdmin(id: string): Promise<boolean> {
        return this.adminRepository.delete(id);
    }
}