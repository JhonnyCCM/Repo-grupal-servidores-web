import { AppDataSource } from './data-source';
import { Admin } from '../domain/models/admin.model';
import { Coach } from '../domain/models/coach.model';
import { User } from '../domain/models/user.model';
import { Plan } from '../domain/models/plan.model';
import { Membership } from '../domain/models/membership.model';
import { GymClass } from '../domain/models/gym-class.model';
import { Machine } from '../domain/models/machine.model';
import { Payment } from '../domain/models/payment.model';
import * as bcrypt from 'bcrypt';
import { DifficultyLevel, MembershipStatus, PaymentStatus, Status } from '../domain/value-objects';

async function seedDatabase() {
  await AppDataSource.initialize();

  console.log('Seeding database...');

//   // Seed Admins
//   const adminRepository = AppDataSource.getRepository(Admin);
//   const hashedPassword = await bcrypt.hash('admin123', 10);
//   const admin = adminRepository.create({
//     email: 'admin@example.com',
//     password: hashedPassword,
//   });
//   await adminRepository.save(admin);

  // Seed Coaches
  const coachRepository = AppDataSource.getRepository(Coach);
  const coach = coachRepository.create({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123456789',
    password: 'coach123',
    gender: 'Male',
    birthDate: new Date('1990-01-01'),
    specialities: ['Yoga', 'Pilates'],
    biography: 'Experienced yoga and pilates instructor.',
    experienceYears: 5,
  });
  await coachRepository.save(coach);

  // Seed Users
  const userRepository = AppDataSource.getRepository(User);
  const user = userRepository.create({
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: 'user123',
    phone: '987654321',
    gender: 'Female',
    birthDate: new Date('1995-05-05'),
    membershipType: 'Premium',
  });
  await userRepository.save(user);

  // Seed Plans
  const planRepository = AppDataSource.getRepository(Plan);
  const plan = planRepository.create({
    name: 'Premium Plan',
    description: 'Access to all facilities and classes.',
    price: 99.99,
    durationInMonths: 1,
    features: ['All classes', 'All machines', 'Personal trainer'],
  });
  await planRepository.save(plan);

  // Seed Memberships
  const membershipRepository = AppDataSource.getRepository(Membership);
  const membership = membershipRepository.create({
    userId: user.id,
    planId: plan.id,
    planName: plan.name,
    planPrice: plan.price,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    status: MembershipStatus.ACTIVE,
  });
  await membershipRepository.save(membership);

  // Seed Gym Classes
  const gymClassRepository = AppDataSource.getRepository(GymClass);
  const gymClass = gymClassRepository.create({
    name: 'Yoga Class',
    description: 'A relaxing yoga class.',
    coachId: coach.id,
    category: ['Yoga'],
    capacity: 20,
    difficultyLevel: DifficultyLevel.BEGINNER,
    schedule: ['Monday 10:00 AM'],
    room: ['Room 1'],
  });
  await gymClassRepository.save(gymClass);

  // Seed Machines
  const machineRepository = AppDataSource.getRepository(Machine);
  const machine = machineRepository.create({
    name: 'Treadmill',
    description: 'A machine for running or walking.',
    specialities: ['Cardio'],
    room: ['Cardio Room'],
    status: Status.ACTIVE,
  });
  await machineRepository.save(machine);

  // Seed Payments
  const paymentRepository = AppDataSource.getRepository(Payment);
  const payment = paymentRepository.create({
    membershipId: membership.id,
    method: 'Credit Card',
    amount: plan.price,
    transactionId: '1234567890',
    status: PaymentStatus.COMPLETED,
  });
  await paymentRepository.save(payment);

  console.log('Database seeded successfully!');

  await AppDataSource.destroy();
}

seedDatabase().catch((error) => console.error('Error seeding database:', error));
