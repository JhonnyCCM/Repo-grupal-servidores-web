import { AppDataSource } from '../../presentation/data-source'
import { Admin } from '../../domain/models/admin.model'
import { Role } from '../../domain/value-objects'
import * as bcrypt from 'bcrypt'

export class AdminService {
    private adminRepository = AppDataSource.getRepository(Admin)

    async createAdmin(adminData: Partial<Admin>): Promise<Admin> {
        if (!adminData.fullName || !adminData.email || !adminData.password) {
            throw new Error('Full name, email, and password are required')
        }

        // Check if email already exists
        const existingAdmin = await this.adminRepository.findOne({
            where: { email: adminData.email }
        })
        if (existingAdmin) {
            throw new Error('Email already exists')
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminData.password, 10)

        const admin = this.adminRepository.create({
            ...adminData,
            password: hashedPassword,
            role: Role.ADMIN,
            accessLevel: adminData.accessLevel || 1,
            permissions: adminData.permissions || []
        })
        return await this.adminRepository.save(admin)
    }

    async updateAdmin(id: string, adminData: Partial<Admin>): Promise<Admin | null> {
        if (adminData.password) {
            adminData.password = await bcrypt.hash(adminData.password, 10)
        }
        await this.adminRepository.update(id, adminData)
        return this.getAdminById(id)
    }

    async getAdminById(id: string): Promise<Admin | null> {
        return await this.adminRepository.findOne({
            where: { id }
        })
    }

    async getAdminByEmail(email: string): Promise<Admin | null> {
        return await this.adminRepository.findOne({
            where: { email }
        })
    }

    async authenticateAdmin(email: string, password: string): Promise<Admin | null> {
        const admin = await this.getAdminByEmail(email)
        if (!admin) {
            return null
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password)
        if (!isPasswordValid) {
            return null
        }

        // Update last login
        await this.adminRepository.update(admin.id, { lastLogin: new Date() })

        return admin
    }

    async updatePermissions(adminId: string, permissions: string[]): Promise<boolean> {
        const result = await this.adminRepository.update(adminId, { permissions })
        return result.affected ? result.affected > 0 : false
    }

    async updateAccessLevel(adminId: string, accessLevel: number): Promise<boolean> {
        if (accessLevel < 1 || accessLevel > 10) {
            throw new Error('Access level must be between 1 and 10')
        }
        const result = await this.adminRepository.update(adminId, { accessLevel })
        return result.affected ? result.affected > 0 : false
    }

    async getAllAdmins(): Promise<Admin[]> {
        return await this.adminRepository.find()
    }

    async getActiveAdmins(): Promise<Admin[]> {
        return await this.adminRepository.find({
            where: { isActive: true }
        })
    }

    async deleteAdmin(id: string): Promise<boolean> {
        const result = await this.adminRepository.delete(id)
        return result.affected ? result.affected > 0 : false
    }
}