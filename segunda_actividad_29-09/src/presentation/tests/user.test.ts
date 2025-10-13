import { UserService } from '../../application/services/user.service.js'
import { InMemoryUserRepository } from '../../infrastructure/repositories/user.repository.js'

export async function testUserCRUD() {
    // 🏗️ ARCHITECTURE: Demostración de capas - Repository → Service
    console.log('🏗️ Inicializando capas de arquitectura...')
    const userRepository = new InMemoryUserRepository()
    const userService = new UserService(userRepository)
    console.log('✅ Repository (Infrastructure) → Service (Application) inicializados')

    return testUserOperations(userService)
}

async function testUserOperations(userService: UserService) {
    console.log('\n========================================')
    console.log('👤 TESTING USER CRUD OPERATIONS')
    console.log('========================================')

    try {
        // CREATE - Crear nuevo usuario
        console.log('\n--- 📝 CREATE: Creando nuevo usuario ---')
        const newUser = await new Promise((resolve, reject) => {
            userService.createUser({
                fullName: "María García",
                email: "maria.garcia@email.com",
                phone: "555-1234",
                password: "password123",
                gender: "Femenino",
                birthDate: new Date("1992-08-15"),
                membershipType: "Premium",
                isActive: true,
                enrolledClasses: []
            }, (error, result) => {
                if (error) reject(error)
                else resolve(result)
            })
        })
        console.log('✅ Usuario creado exitosamente con ID:', newUser)

        // READ - Obtener usuario por ID
        console.log('\n--- 👀 READ: Obteniendo usuario por ID ---')
        const retrievedUser = await userService.getUserById(newUser as string)
        if (retrievedUser) {
            console.log('✅ Usuario encontrado:', {
                id: retrievedUser.id,
                name: retrievedUser.fullName,
                email: retrievedUser.email,
                membershipType: retrievedUser.membershipType,
                isActive: retrievedUser.isActive
            })
        } else {
            console.log('❌ Usuario no encontrado')
        }

        // READ ALL - Obtener todos los usuarios
        console.log('\n--- 📋 READ ALL: Obteniendo todos los usuarios ---')
        const allUsers = await userService.getAllUsers()
        console.log(`✅ Total de usuarios encontrados: ${allUsers.length}`)
        allUsers.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.fullName} (${user.email}) - ${user.membershipType}`)
        })

        // UPDATE - Actualizar usuario
        console.log('\n--- ✏️ UPDATE: Actualizando datos del usuario ---')
        const updatedUser = await userService.updateUser(newUser as string, {
            fullName: "María García Rodriguez",
            membershipType: "VIP",
            phone: "555-5678",
            updatedAt: new Date()
        })
        if (updatedUser) {
            console.log('✅ Usuario actualizado exitosamente:', {
                name: updatedUser.fullName,
                membershipType: updatedUser.membershipType,
                phone: updatedUser.phone,
                updatedAt: updatedUser.updatedAt?.toLocaleString()
            })
        } else {
            console.log('❌ Error al actualizar usuario')
        }

        // DELETE - Eliminar usuario
        console.log('\n--- 🗑️ DELETE: Eliminando usuario ---')
        const deleteResult = await userService.deleteUser(newUser as string)
        if (deleteResult) {
            console.log('✅ Usuario eliminado exitosamente')
        } else {
            console.log('❌ Error al eliminar usuario')
        }

        // VERIFICAR DELETE - Confirmar eliminación
        console.log('\n--- 🔍 VERIFY DELETE: Verificando eliminación ---')
        const deletedUser = await userService.getUserById(newUser as string)
        if (deletedUser === null) {
            console.log('✅ Confirmado: Usuario eliminado correctamente')
        } else {
            console.log('❌ Error: Usuario aún existe en la base de datos')
        }

        console.log('\n✅ USER CRUD TEST COMPLETADO EXITOSAMENTE')

    } catch (error) {
        console.error('\n❌ ERROR EN USER CRUD TEST:', error)
    }

    console.log('========================================\n')
}