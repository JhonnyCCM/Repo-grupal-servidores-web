import { AppDataSource } from "../presentation/data-source";
import { CoachService } from "../application/services/coach.service";
import { GymClassService } from "../application/services/gym-class.service";
import { MachineService } from "../application/services/machine.service";
import { DifficultyLevel, Role, Status } from "../domain/value-objects";

async function main() {
    try {
        await AppDataSource.initialize();
        console.log("¡Conexión a la base de datos establecida!");

        const coachService = new CoachService();
        const gymClassService = new GymClassService();
        const machineService = new MachineService();

        // 1. Crear un entrenador
        console.log("\n--- Creando un entrenador ---");
        const newCoach = await coachService.createCoach({
            fullName: "John Doe",
            email: "john.doe@gym.com",
            phone: "123-456-7890",
            role: Role.COACH,
            passwordHash: "hashedpassword123",
            biography: "Entrenador profesional con 5 años de experiencia",
            imageUrl: "https://example.com/john-doe.jpg",
            specialities: [
                { id: "1", name: "Yoga", description: "Instructor certificado de Yoga" }
            ],
            experienceYears: 5,
            isActive: true
        });
        console.log("Entrenador creado:", newCoach);

        // 2. Crear una clase con el entrenador
        console.log("\n--- Creando una clase de gimnasio ---");
        const newClass = await gymClassService.createGymClass({
            name: "Yoga Matutino",
            description: "Una clase para empezar el día con energía",
            schedule: "Lunes y Miércoles 8:00 AM",
            capacity: 15,
            difficultyLevel: DifficultyLevel.BEGINNER,
            coach: newCoach
        });
        console.log("Clase creada:", newClass);

        // 3. Crear una máquina
        console.log("\n--- Creando una máquina de ejercicio ---");
        const newMachine = await machineService.createMachine({
            name: "Cinta de Correr Pro",
            description: "Cinta de correr profesional con inclinación automática",
            specialities: [
                { id: "1", name: "Cardio", description: "Ejercicio cardiovascular" }
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
            imageUrl: "https://example.com/treadmill.jpg",
            room: [
                { id: "1", name: "Sala Cardio", description: "Área de cardio", location: "Piso 1", capacity: 20 }
            ],
            status: Status.MAINTENANCE
        });
        console.log("Máquina creada:", newMachine);

        // 4. Obtener todos los elementos
        console.log("\n--- Listando todos los elementos ---");
        const allCoaches = await coachService.getAllCoaches();
        console.log("Todos los entrenadores:", allCoaches);

        const allClasses = await gymClassService.getAllGymClasses();
        console.log("Todas las clases:", allClasses);

        const allMachines = await machineService.getAllMachines();
        console.log("Todas las máquinas:", allMachines);

        // 5. Actualizar elementos
        console.log("\n--- Actualizando elementos ---");
        const updatedCoach = await coachService.updateCoach(newCoach.id, {
            biography: "Entrenador profesional con 6 años de experiencia y especialización en Yoga"
        });
        console.log("Entrenador actualizado:", updatedCoach);

        const updatedClass = await gymClassService.updateGymClass(newClass.id, {
            description: "Una clase de yoga revitalizante para todos los niveles"
        });
        console.log("Clase actualizada:", updatedClass);

        const updatedMachine = await machineService.updateMachine(newMachine.id, {
            status: Status.MAINTENANCE
        });
        console.log("Máquina actualizada:", updatedMachine);

        // 6. Eliminar elementos
        console.log("\n--- Eliminando elementos ---");
        await machineService.deleteMachine(newMachine.id);
        console.log("Máquina eliminada");

        await gymClassService.deleteGymClass(newClass.id);
        console.log("Clase eliminada");

        await coachService.deleteCoach(newCoach.id);
        console.log("Entrenador eliminado");

    } catch (error) {
        console.error("Error durante la ejecución:", error);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log("\nConexión a la base de datos cerrada.");
        }
    }
}

main();