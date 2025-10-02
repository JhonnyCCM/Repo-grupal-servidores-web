import { CoachService } from '../application/coach.service.js';
import { MachineService } from '../application/machine.service.js';
import { GymClassService } from '../application/gymClass.service.js';
import { InMemoryCoachRepository } from '../infrastructure/in-memory/coach.repository.js';
import { InMemoryMachineRepository } from '../infrastructure/in-memory/machine.repository.js';
import { InMemoryGymClassRepository } from '../infrastructure/in-memory/gymClass.repository.js';

const coachRepository = new InMemoryCoachRepository();
const machineRepository = new InMemoryMachineRepository();
const gymClassRepository = new InMemoryGymClassRepository();

const coachService = new CoachService(coachRepository);
const machineService = new MachineService(machineRepository);
const gymClassService = new GymClassService(gymClassRepository);

// --- Coach CRUD ---
console.log('--- Coach CRUD ---');

// Create
coachService.createCoach({ fullName: 'John Doe', email: 'john.doe@example.com', phone: '123456789' }, (err, id) => {
    if (err) {
        console.error('Error creating coach:', err.message);
        return;
    }
    console.log('Coach created with id:', id);

    // Read
    coachService.getCoachById(id!).then(coach => {
        console.log('Coach found:', coach);

        // Update
        coachService.updateCoach(id!, { phone: '987654321' }).then(updatedCoach => {
            console.log('Coach updated:', updatedCoach);

            // Read All
            coachService.getAllCoaches().then(coaches => {
                console.log('All coaches:', coaches);

                // Delete
                coachService.deleteCoach(id!).then(success => {
                    console.log('Coach deleted:', success);

                    // Read All
                    coachService.getAllCoaches().then(coaches => {
                        console.log('All coaches after deletion:', coaches);
                    });
                });
            });
        });
    });
});


// --- Machine CRUD ---
setTimeout(() => {
    console.log('\n--- Machine CRUD ---');

    // Create
    machineService.createMachine({ name: 'Treadmill', description: 'Cardio machine', brand: 'Technogym', isAvailable: true }, (err, id) => {
        if (err) {
            console.error('Error creating machine:', err.message);
            return;
        }
        console.log('Machine created with id:', id);

        // Read
        machineService.getMachineById(id!).then(machine => {
            console.log('Machine found:', machine);

            // Update
            machineService.updateMachine(id!, { isAvailable: false }).then(updatedMachine => {
                console.log('Machine updated:', updatedMachine);

                // Read All
                machineService.getAllMachines().then(machines => {
                    console.log('All machines:', machines);

                    // Delete
                    machineService.deleteMachine(id!).then(success => {
                        console.log('Machine deleted:', success);

                        // Read All
                        machineService.getAllMachines().then(machines => {
                            console.log('All machines after deletion:', machines);
                        });
                    });
                });
            });
        });
    });
}, 3000);


// --- GymClass CRUD ---
setTimeout(() => {
    console.log('\n--- GymClass CRUD ---');

    // Create
    gymClassService.createGymClass({ name: 'Yoga', description: 'Relaxing yoga class', schedule: 'Mon 6pm', capacity: 15 }, (err, id) => {
        if (err) {
            console.error('Error creating gym class:', err.message);
            return;
        }
        console.log('Gym class created with id:', id);

        // Read
        gymClassService.getGymClassById(id!).then(gymClass => {
            console.log('Gym class found:', gymClass);

            // Update
            gymClassService.updateGymClass(id!, { capacity: 20 }).then(updatedGymClass => {
                console.log('Gym class updated:', updatedGymClass);

                // Read All
                gymClassService.getAllGymClasses().then(gymClasses => {
                    console.log('All gym classes:', gymClasses);

                    // Delete
                    gymClassService.deleteGymClass(id!).then(success => {
                        console.log('Gym class deleted:', success);

                        // Read All
                        gymClassService.getAllGymClasses().then(gymClasses => {
                            console.log('All gym classes after deletion:', gymClasses);
                        });
                    });
                });
            });
        });
    });
}, 6000);
