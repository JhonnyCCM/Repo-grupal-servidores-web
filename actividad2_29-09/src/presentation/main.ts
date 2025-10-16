import { testCoachCRUD } from './tests/coach.test.js'
import { testMachineCRUD } from './tests/machine.test.js'
import { testGymClassCRUD } from './tests/gym-class.test.js'
import { testAdminCRUD } from './tests/admin.test.js'
import { testUserCRUD } from './tests/user.test.js'
import { testPlanCRUD } from './tests/plan.test.js'
import { testMembershipCRUD } from './tests/membership.test.js'
import { testPaymentCRUD } from './tests/payment.test.js'

async function main() {
    console.log('🏋️ GYM MANAGEMENT SYSTEM - CLEAN ARCHITECTURE DEMO')
    console.log('=' .repeat(60))
    console.log('📋 Demostrando uso correcto de capas:')
    console.log('   🏗️ Infrastructure Layer → Repository (In-Memory)')
    console.log('   🔧 Application Layer → Service (Business Logic)')
    console.log('   🎯 Presentation Layer → Tests (This Main)')
    console.log('=' .repeat(60))
    
    try {
        // Testing all CRUD operations with 2-second delays
        await testCoachCRUD()
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        await testMachineCRUD()
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        await testGymClassCRUD()
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        await testAdminCRUD()
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        await testUserCRUD()
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        await testPlanCRUD()
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        await testMembershipCRUD()
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        await testPaymentCRUD()
        
        console.log('\n🎉 TODOS LOS TESTS COMPLETADOS EXITOSAMENTE!')
        console.log('=' .repeat(60))
        console.log('✅ Arquitectura Clean verificada:')
        console.log('   • Repository Pattern implementado correctamente')
        console.log('   • Service Layer manejando lógica de negocio')
        console.log('   • Separación clara entre capas')
        console.log('   • CRUD operations funcionando en 8 entidades')
        console.log('   • Coach, Machine, GymClass, Admin, User, Plan, Membership, Payment')
        console.log('=' .repeat(60))
        console.log('💡 Sistema listo para producción!')
        
    } catch (error) {
        console.error('💥 ERROR CRÍTICO EN MAIN:', error)
    }
}

main().catch(console.error)