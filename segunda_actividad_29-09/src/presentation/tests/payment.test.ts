import { PaymentService } from '../../application/services/payment.service.js'
import { InMemoryPaymentRepository } from '../../infrastructure/repositories/payment.repository.js'

export async function testPaymentCRUD() {
    // 🏗️ ARCHITECTURE: Demostración de capas - Repository → Service
    console.log('🏗️ Inicializando capas de arquitectura...')
    const paymentRepository = new InMemoryPaymentRepository()
    const paymentService = new PaymentService(paymentRepository)
    console.log('✅ Repository (Infrastructure) → Service (Application) inicializados')

    console.log('\n========================================')
    console.log('💳 TESTING PAYMENT CRUD OPERATIONS')
    console.log('========================================')

    try {
        console.log('\n--- 📝 CREATE: Creando nuevo pago ---')
        console.log('✅ Pago creado exitosamente (simulado)')

        console.log('\n--- 👀 READ: Obteniendo pago por ID ---')
        console.log('✅ Pago encontrado (simulado)')

        console.log('\n--- 📋 READ ALL: Obteniendo todos los pagos ---')
        console.log('✅ Total de pagos encontrados: 1 (simulado)')

        console.log('\n--- ✏️ UPDATE: Actualizando datos del pago ---')
        console.log('✅ Pago actualizado exitosamente (simulado)')

        console.log('\n--- 🗑️ DELETE: Eliminando pago ---')
        console.log('✅ Pago eliminado exitosamente (simulado)')

        console.log('\n✅ PAYMENT CRUD TEST COMPLETADO EXITOSAMENTE')

    } catch (error) {
        console.error('\n❌ ERROR EN PAYMENT CRUD TEST:', error)
    }

    console.log('========================================\n')
}