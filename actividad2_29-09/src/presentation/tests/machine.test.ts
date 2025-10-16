import { MachineService } from '../../application/services/machine.service.js'
import { InMemoryMachineRepository } from '../../infrastructure/repositories/machine.repository.js'
import { Status } from '../../domain/value-objects.js'

export async function testMachineCRUD() {
    // 🏗️ ARCHITECTURE: Demostración de capas - Repository → Service
    console.log('🏗️ Inicializando capas de arquitectura...')
    const machineRepository = new InMemoryMachineRepository()
    const machineService = new MachineService(machineRepository)
    console.log('✅ Repository (Infrastructure) → Service (Application) inicializados')

    return testMachineOperations(machineService)
}

async function testMachineOperations(machineService: MachineService) {
    console.log('\n========================================')
    console.log('🏋️‍♂️ TESTING MACHINE CRUD OPERATIONS')
    console.log('========================================')

    try {
        // CREATE - Crear nueva máquina
        console.log('\n--- 📝 CREATE: Creando nueva máquina ---')
        const newMachine = await new Promise((resolve, reject) => {
            machineService.createMachine({
                name: "Cinta de Correr Pro",
                description: "Cinta de correr profesional con inclinación automática",
                specialities: [
                    { id: "1", name: "Cardio", description: "Ejercicios cardiovasculares" }
                ],
                createdAt: new Date(),
                status: Status.ACTIVE,
                imageUrl: "https://example.com/treadmill.jpg",
                room: [{ id: "1", name: "Sala Cardio", description: "Área de ejercicios cardiovasculares", location: "Planta baja", capacity: 20 }]
            }, (error, result) => {
                if (error) reject(error)
                else resolve(result)
            })
        })
        console.log('✅ Máquina creada exitosamente con ID:', newMachine)

        // READ - Obtener máquina por ID
        console.log('\n--- 👀 READ: Obteniendo máquina por ID ---')
        const retrievedMachine = await machineService.getMachineById(newMachine as string)
        if (retrievedMachine) {
            console.log('✅ Máquina encontrada:', {
                id: retrievedMachine.id,
                name: retrievedMachine.name,
                specialities: retrievedMachine.specialities.map(s => s.name),
                status: retrievedMachine.status
            })
        } else {
            console.log('❌ Máquina no encontrada')
        }

        // READ ALL - Obtener todas las máquinas
        console.log('\n--- 📋 READ ALL: Obteniendo todas las máquinas ---')
        const allMachines = await machineService.getAllMachines()
        console.log(`✅ Total de máquinas encontradas: ${allMachines.length}`)
        allMachines.forEach((machine, index) => {
            const specialitiesText = machine.specialities.map(s => s.name).join(', ')
            console.log(`   ${index + 1}. ${machine.name} (${specialitiesText}) - ${machine.status}`)
        })

        // UPDATE - Actualizar máquina
        console.log('\n--- ✏️ UPDATE: Actualizando datos de la máquina ---')
        const updatedMachine = await machineService.updateMachine(newMachine as string, {
            name: "Cinta de Correr Pro Max",
            description: "Cinta de correr profesional con inclinación automática y programas personalizados",
            status: Status.MAINTENANCE,
            updatedAt: new Date()
        })
        if (updatedMachine) {
            console.log('✅ Máquina actualizada exitosamente:', {
                name: updatedMachine.name,
                status: updatedMachine.status,
                updatedAt: updatedMachine.updatedAt?.toLocaleDateString()
            })
        } else {
            console.log('❌ Error al actualizar máquina')
        }

        // DELETE - Eliminar máquina
        console.log('\n--- 🗑️ DELETE: Eliminando máquina ---')
        const deleteResult = await machineService.deleteMachine(newMachine as string)
        if (deleteResult) {
            console.log('✅ Máquina eliminada exitosamente')
        } else {
            console.log('❌ Error al eliminar máquina')
        }

        // VERIFICAR DELETE - Confirmar eliminación
        console.log('\n--- 🔍 VERIFY DELETE: Verificando eliminación ---')
        const deletedMachine = await machineService.getMachineById(newMachine as string)
        if (deletedMachine === null) {
            console.log('✅ Confirmado: Máquina eliminada correctamente')
        } else {
            console.log('❌ Error: Máquina aún existe en la base de datos')
        }

        console.log('\n✅ MACHINE CRUD TEST COMPLETADO EXITOSAMENTE')

    } catch (error) {
        console.error('\n❌ ERROR EN MACHINE CRUD TEST:', error)
    }

    console.log('========================================\n')
}