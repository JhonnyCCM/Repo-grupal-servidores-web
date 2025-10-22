import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserStats {
    @Field(() => Int)
    totalUsers: number;

    @Field(() => Int)
    activeUsers: number;

    @Field(() => Int)
    inactiveUsers: number;

    @Field(() => Int)
    adminUsers: number;

    @Field(() => Int)
    regularUsers: number;

    @Field(() => Int)
    coachUsers: number;
}

@ObjectType()
export class ClassStats {
    @Field(() => Int)
    totalClasses: number;

    @Field(() => Int)
    activeClasses: number;

    @Field(() => Int)
    beginnerClasses: number;

    @Field(() => Int)
    intermediateClasses: number;

    @Field(() => Int)
    advancedClasses: number;

    @Field(() => Int)
    classesWithoutCoach: number;
}

@ObjectType()
export class EquipmentStats {
    @Field(() => Int)
    totalEquipment: number;

    @Field(() => Int)
    availableEquipment: number;

    @Field(() => Int)
    inactiveEquipment: number;

    @Field(() => Int)
    maintenanceEquipment: number;
}