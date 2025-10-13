import { CoachService } from '../../application/services/coach.service.js'
import { InMemoryCoachRepository } from '../../infrastructure/repositories/coach.repository.js'

export async function testCoachCRUD() {
    // 🏗️ ARCHITECTURE: Demostración de capas - Repository → Service
    console.log('🏗️ Inicializando capas de arquitectura...')
    const coachRepository = new InMemoryCoachRepository()
    const coachService = new CoachService(coachRepository)
    console.log('✅ Repository (Infrastructure) → Service (Application) inicializados')

    return testCoachOperations(coachService)
}

async function testCoachOperations(coachService: CoachService) {
    console.log('\n========================================')
    console.log('🏃‍♂️ TESTING COACH CRUD OPERATIONS')
    console.log('========================================')

    try {
        // CREATE - Crear nuevo coach
        console.log('\n--- 📝 CREATE: Creando nuevo coach ---')
        const newCoach = await new Promise((resolve, reject) => {
            coachService.createCoach({
                fullName: "Carlos Mendez",
                email: "carlos.mendez@gym.com",
                phone: "555-0123",
                password: "password123",
                gender: "Masculino",
                birthDate: new Date("1985-03-15"),
                specialities: [
                    { id: "1", name: "Crossfit", description: "Entrenamiento funcional de alta intensidad" },
                    { id: "2", name: "Funcional", description: "Ejercicios funcionales" }
                ],
                biography: "Entrenador certificado con 8 años de experiencia",
                experienceYears: 8,
                imageUrl: "https://example.com/carlos.jpg",
                createdAt: new Date(),
                isActive: true,
                classes: []
            }, (error, result) => {
                if (error) reject(error)
                else resolve(result)
            })
        })
        console.log('✅ Coach creado exitosamente con ID:', newCoach)

        // READ - Obtener coach por ID
        console.log('\n--- 👀 READ: Obteniendo coach por ID ---')
        const retrievedCoach = await coachService.getCoachById(newCoach as string)
        if (retrievedCoach) {
            console.log('✅ Coach encontrado:', {
                id: retrievedCoach.id,
                name: retrievedCoach.fullName,
                email: retrievedCoach.email,
                specialities: retrievedCoach.specialities
            })
        } else {
            console.log('❌ Coach no encontrado')
        }

        // READ ALL - Obtener todos los coaches
        console.log('\n--- 📋 READ ALL: Obteniendo todos los coaches ---')
        const allCoaches = await coachService.getAllCoaches()
        console.log(`✅ Total de coaches encontrados: ${allCoaches.length}`)
        allCoaches.forEach((coach, index) => {
            console.log(`   ${index + 1}. ${coach.fullName} (${coach.email})`)
        })

        // UPDATE - Actualizar coach
        console.log('\n--- ✏️ UPDATE: Actualizando datos del coach ---')
        const updatedCoach = await coachService.updateCoach(newCoach as string, {
            fullName: "Carlos Mendez Rodriguez",
            specialities: [
                { id: "1", name: "Crossfit", description: "Entrenamiento funcional de alta intensidad" },
                { id: "2", name: "Funcional", description: "Ejercicios funcionales" },
                { id: "3", name: "Powerlifting", description: "Levantamiento de potencia" }
            ],
            experienceYears: 9
        })
        if (updatedCoach) {
            console.log('✅ Coach actualizado exitosamente:', {
                name: updatedCoach.fullName,
                specialities: updatedCoach.specialities,
                experience: updatedCoach.experienceYears + ' años'
            })
        } else {
            console.log('❌ Error al actualizar coach')
        }

        // DELETE - Eliminar coach
        console.log('\n--- 🗑️ DELETE: Eliminando coach ---')
        const deleteResult = await coachService.deleteCoach(newCoach as string)
        if (deleteResult) {
            console.log('✅ Coach eliminado exitosamente')
        } else {
            console.log('❌ Error al eliminar coach')
        }

        // VERIFICAR DELETE - Confirmar eliminación
        console.log('\n--- 🔍 VERIFY DELETE: Verificando eliminación ---')
        const deletedCoach = await coachService.getCoachById(newCoach as string)
        if (deletedCoach === null) {
            console.log('✅ Confirmado: Coach eliminado correctamente')
        } else {
            console.log('❌ Error: Coach aún existe en la base de datos')
        }

        console.log('\n✅ COACH CRUD TEST COMPLETADO EXITOSAMENTE')

    } catch (error) {
        console.error('\n❌ ERROR EN COACH CRUD TEST:', error)
    }

    console.log('========================================\n')
}