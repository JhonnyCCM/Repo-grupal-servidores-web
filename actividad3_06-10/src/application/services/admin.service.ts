import { AppDataSource } from '../../presentation/data-source'
import { Admin } from '../../domain/models/admin.model'
import * as bcrypt from 'bcrypt'

export class AdminService {
    private adminRepository = AppDataSource.getRepository(Admin)

    async createAdmin(adminData: Partial<Admin>): Promise<Admin> {
        if (!adminData.email || !adminData.password) {
            throw new Error('Email and password are required')
        }

        const existingAdmin = await this.adminRepository.findOne({
            where: { email: adminData.email }
        })
        if (existingAdmin) {
            throw new Error('Email already exists')
        }

        const hashedPassword = await bcrypt.hash(adminData.password, 10)

        const admin = this.adminRepository.create({
            ...adminData,
            password: hashedPassword
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

        return admin
    }

    async getAllAdmins(): Promise<Admin[]> {
        return await this.adminRepository.find()
    }

    async deleteAdmin(id: string): Promise<boolean> {
        const result = await this.adminRepository.delete(id)
        return result.affected ? result.affected > 0 : false
    }
}