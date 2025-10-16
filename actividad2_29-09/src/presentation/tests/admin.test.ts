import { AdminService } from '../../application/services/admin.service.js'
import { InMemoryAdminRepository } from '../../infrastructure/repositories/admin.repository.js'

export async function testAdminCRUD() {
    // 🏗️ ARCHITECTURE: Demostración de capas - Repository → Service
    console.log('🏗️ Inicializando capas de arquitectura...')
    const adminRepository = new InMemoryAdminRepository()
    const adminService = new AdminService(adminRepository)
    console.log('✅ Repository (Infrastructure) → Service (Application) inicializados')

    return testAdminOperations(adminService)
}

async function testAdminOperations(adminService: AdminService) {
    console.log('\n========================================')
    console.log('👨‍💼 TESTING ADMIN CRUD OPERATIONS')
    console.log('========================================')

    try {
        // CREATE - Crear nuevo admin
        console.log('\n--- 📝 CREATE: Creando nuevo admin ---')
        const newAdmin = await new Promise((resolve, reject) => {
            adminService.createAdmin({
                email: "roberto.admin@gym.com",
                password: "admin123"
            }, (error, result) => {
                if (error) reject(error)
                else resolve(result)
            })
        })
        console.log('✅ Admin creado exitosamente con ID:', newAdmin)

        // READ - Obtener admin por ID
        console.log('\n--- 👀 READ: Obteniendo admin por ID ---')
        const retrievedAdmin = await adminService.getAdminById(newAdmin as string)
        if (retrievedAdmin) {
            console.log('✅ Admin encontrado:', {
                id: retrievedAdmin.id,
                email: retrievedAdmin.email,
                createdAt: retrievedAdmin.createdAt.toLocaleString()
            })
        } else {
            console.log('❌ Admin no encontrado')
        }

        // READ ALL - Obtener todos los admins
        console.log('\n--- 📋 READ ALL: Obteniendo todos los admins ---')
        const allAdmins = await adminService.getAllAdmins()
        console.log(`✅ Total de admins encontrados: ${allAdmins.length}`)
        allAdmins.forEach((admin, index) => {
            console.log(`   ${index + 1}. Admin (${admin.email}) - Creado: ${admin.createdAt.toLocaleDateString()}`)
        })

        // UPDATE - Actualizar admin
        console.log('\n--- ✏️ UPDATE: Actualizando datos del admin ---')
        const updatedAdmin = await adminService.updateAdmin(newAdmin as string, {
            email: "roberto.senior@gym.com",
            updatedAt: new Date()
        })
        if (updatedAdmin) {
            console.log('✅ Admin actualizado exitosamente:', {
                email: updatedAdmin.email,
                updatedAt: updatedAdmin.updatedAt?.toLocaleString()
            })
        } else {
            console.log('❌ Error al actualizar admin')
        }

        // DELETE - Eliminar admin
        console.log('\n--- 🗑️ DELETE: Eliminando admin ---')
        const deleteResult = await adminService.deleteAdmin(newAdmin as string)
        if (deleteResult) {
            console.log('✅ Admin eliminado exitosamente')
        } else {
            console.log('❌ Error al eliminar admin')
        }

        // VERIFICAR DELETE - Confirmar eliminación
        console.log('\n--- 🔍 VERIFY DELETE: Verificando eliminación ---')
        const deletedAdmin = await adminService.getAdminById(newAdmin as string)
        if (deletedAdmin === null) {
            console.log('✅ Confirmado: Admin eliminado correctamente')
        } else {
            console.log('❌ Error: Admin aún existe en la base de datos')
        }

        console.log('\n✅ ADMIN CRUD TEST COMPLETADO EXITOSAMENTE')

    } catch (error) {
        console.error('\n❌ ERROR EN ADMIN CRUD TEST:', error)
    }

    console.log('========================================\n')
}