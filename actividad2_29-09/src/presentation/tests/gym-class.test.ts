import { GymClassService } from '../../application/services/gym-class.service.js'
import { InMemoryGymClassRepository } from '../../infrastructure/repositories/gym-class.repository.js'
import { DifficultyLevel } from '../../domain/value-objects.js'

export async function testGymClassCRUD() {
    // 🏗️ ARCHITECTURE: Demostración de capas - Repository → Service
    console.log('🏗️ Inicializando capas de arquitectura...')
    const gymClassRepository = new InMemoryGymClassRepository()
    const gymClassService = new GymClassService(gymClassRepository)
    console.log('✅ Repository (Infrastructure) → Service (Application) inicializados')

    return testGymClassOperations(gymClassService)
}

async function testGymClassOperations(gymClassService: GymClassService) {
    console.log('\n========================================')
    console.log('🏃‍♀️ TESTING GYM CLASS CRUD OPERATIONS')
    console.log('========================================')

    try {
        // CREATE - Crear nueva clase
        console.log('\n--- 📝 CREATE: Creando nueva clase ---')
        // Crear un coach mock para la prueba
        const mockCoach = {
            id: "coach-123",
            fullName: "Ana García",
            email: "ana@gym.com",
            phone: "555-0000",
            password: "password",
            gender: "Femenino",
            birthDate: new Date("1990-01-01"),
            createdAt: new Date(),
            specialities: [{ id: "1", name: "Yoga", description: "Instructor de yoga" }],
            isActive: true,
            biography: "Instructora certificada de yoga",
            experienceYears: 5,
            classes: [],
            imageUrl: "https://example.com/ana.jpg"
        }

        const newClass = await new Promise((resolve, reject) => {
            gymClassService.createGymClass({
                name: "Yoga Matutino",
                description: "Clase de yoga relajante para comenzar el día",
                coachId: mockCoach as any,
                category: { id: "1", name: "Yoga", description: "Ejercicios de yoga y meditación" },
                capacity: 15,
                isActive: true,
                createdAt: new Date(),
                difficultyLevel: DifficultyLevel.BEGINNER,
                schedule: [
                    { day: "Lunes", startTime: "07:00", endTime: "08:00" },
                    { day: "Miércoles", startTime: "07:00", endTime: "08:00" },
                    { day: "Viernes", startTime: "07:00", endTime: "08:00" }
                ],
                room: { id: "1", name: "Sala Yoga", description: "Sala especializada en yoga", location: "Planta alta", capacity: 20 },
                enrolledMembers: [],
                imageUrl: "https://example.com/yoga-class.jpg"
            }, (error, result) => {
                if (error) reject(error)
                else resolve(result)
            })
        })
        console.log('✅ Clase creada exitosamente con ID:', newClass)

        // READ - Obtener clase por ID
        console.log('\n--- 👀 READ: Obteniendo clase por ID ---')
        const retrievedClass = await gymClassService.getGymClassById(newClass as string)
        if (retrievedClass) {
            console.log('✅ Clase encontrada:', {
                id: retrievedClass.id,
                name: retrievedClass.name,
                capacity: retrievedClass.capacity,
                difficulty: retrievedClass.difficultyLevel,
                category: retrievedClass.category.name
            })
        } else {
            console.log('❌ Clase no encontrada')
        }

        // READ ALL - Obtener todas las clases
        console.log('\n--- 📋 READ ALL: Obteniendo todas las clases ---')
        const allClasses = await gymClassService.getAllGymClasses()
        console.log(`✅ Total de clases encontradas: ${allClasses.length}`)
        allClasses.forEach((gymClass, index) => {
            console.log(`   ${index + 1}. ${gymClass.name} (${gymClass.difficultyLevel}) - Capacidad: ${gymClass.capacity}`)
        })

        // UPDATE - Actualizar clase
        console.log('\n--- ✏️ UPDATE: Actualizando datos de la clase ---')
        const updatedClass = await gymClassService.updateGymClass(newClass as string, {
            name: "Yoga Matutino Avanzado",
            description: "Clase de yoga con posturas avanzadas para comenzar el día",
            capacity: 12,
            difficultyLevel: DifficultyLevel.INTERMEDIATE,
            updatedAt: new Date()
        })
        if (updatedClass) {
            console.log('✅ Clase actualizada exitosamente:', {
                name: updatedClass.name,
                capacity: updatedClass.capacity,
                difficulty: updatedClass.difficultyLevel,
                updatedAt: updatedClass.updatedAt?.toLocaleDateString()
            })
        } else {
            console.log('❌ Error al actualizar clase')
        }

        // DELETE - Eliminar clase
        console.log('\n--- 🗑️ DELETE: Eliminando clase ---')
        const deleteResult = await gymClassService.deleteGymClass(newClass as string)
        if (deleteResult) {
            console.log('✅ Clase eliminada exitosamente')
        } else {
            console.log('❌ Error al eliminar clase')
        }

        // VERIFICAR DELETE - Confirmar eliminación
        console.log('\n--- 🔍 VERIFY DELETE: Verificando eliminación ---')
        const deletedClass = await gymClassService.getGymClassById(newClass as string)
        if (deletedClass === null) {
            console.log('✅ Confirmado: Clase eliminada correctamente')
        } else {
            console.log('❌ Error: Clase aún existe en la base de datos')
        }

        console.log('\n✅ GYM CLASS CRUD TEST COMPLETADO EXITOSAMENTE')

    } catch (error) {
        console.error('\n❌ ERROR EN GYM CLASS CRUD TEST:', error)
    }

    console.log('========================================\n')
}