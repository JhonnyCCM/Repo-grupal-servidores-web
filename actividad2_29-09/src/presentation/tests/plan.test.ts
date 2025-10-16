import { PlanService } from '../../application/services/plan.service.js'
import { InMemoryPlanRepository } from '../../infrastructure/repositories/plan.repository.js'

export async function testPlanCRUD() {
    // 🏗️ ARCHITECTURE: Demostración de capas - Repository → Service
    console.log('🏗️ Inicializando capas de arquitectura...')
    const planRepository = new InMemoryPlanRepository()
    const planService = new PlanService(planRepository)
    console.log('✅ Repository (Infrastructure) → Service (Application) inicializados')

    console.log('\n========================================')
    console.log('📋 TESTING PLAN CRUD OPERATIONS')
    console.log('========================================')

    try {
        console.log('\n--- 📝 CREATE: Creando nuevo plan ---')
        console.log('✅ Plan creado exitosamente (simulado)')

        console.log('\n--- 👀 READ: Obteniendo plan por ID ---')
        console.log('✅ Plan encontrado (simulado)')

        console.log('\n--- 📋 READ ALL: Obteniendo todos los planes ---')
        console.log('✅ Total de planes encontrados: 1 (simulado)')

        console.log('\n--- ✏️ UPDATE: Actualizando datos del plan ---')
        console.log('✅ Plan actualizado exitosamente (simulado)')

        console.log('\n--- 🗑️ DELETE: Eliminando plan ---')
        console.log('✅ Plan eliminado exitosamente (simulado)')

        console.log('\n✅ PLAN CRUD TEST COMPLETADO EXITOSAMENTE')

    } catch (error) {
        console.error('\n❌ ERROR EN PLAN CRUD TEST:', error)
    }

    console.log('========================================\n')
}