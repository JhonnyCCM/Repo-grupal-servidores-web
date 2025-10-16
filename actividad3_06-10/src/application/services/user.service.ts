import { AppDataSource } from '../../presentation/data-source'
import { User } from '../../domain/models/user.model'
import * as bcrypt from 'bcrypt'

export class UserService {
    private userRepository = AppDataSource.getRepository(User)

    async createUser(userData: Partial<User>): Promise<User> {
        if (!userData.fullName || !userData.email || !userData.password) {
            throw new Error('Full name, email, and password are required')
        }

        const existingUser = await this.userRepository.findOne({
            where: { email: userData.email }
        })
        if (existingUser) {
            throw new Error('Email already exists')
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10)

        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword
        })
        return await this.userRepository.save(user)
    }

    async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10)
        }
        await this.userRepository.update(id, userData)
        return this.getUserById(id)
    }

    async getUserById(id: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { id }
        })
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { email }
        })
    }

    async authenticateUser(email: string, password: string): Promise<User | null> {
        const user = await this.getUserByEmail(email)
        if (!user) {
            return null
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return null
        }

        return user
    }



    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find()
    }

    async getActiveUsers(): Promise<User[]> {
        return await this.userRepository.find({
            where: { isActive: true }
        })
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await this.userRepository.delete(id)
        return result.affected ? result.affected > 0 : false
    }
}