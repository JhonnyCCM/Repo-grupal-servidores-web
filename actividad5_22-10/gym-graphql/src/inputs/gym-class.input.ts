import { InputType, Field, ID } from '@nestjs/graphql';
import { DifficultyLevel } from '../common/enums';

@InputType()
export class CreateGymClassInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => ID)
    coachId: string;

    @Field(() => DifficultyLevel)
    difficultyLevel: DifficultyLevel;

    @Field({ nullable: true })
    imageUrl?: string;

    @Field(() => ID, { nullable: true })
    scheduleId?: string;

    @Field(() => ID, { nullable: true })
    roomId?: string;
}

@InputType()
export class UpdateGymClassInput {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => ID, { nullable: true })
    coachId?: string;

    @Field(() => DifficultyLevel, { nullable: true })
    difficultyLevel?: DifficultyLevel;

    @Field({ nullable: true })
    imageUrl?: string;

    @Field(() => ID, { nullable: true })
    scheduleId?: string;

    @Field(() => ID, { nullable: true })
    roomId?: string;

    @Field({ nullable: true })
    isActive?: boolean;
}

@InputType()
export class FilterGymClassInput {
    @Field(() => DifficultyLevel, { nullable: true })
    difficultyLevel?: DifficultyLevel;

    @Field(() => ID, { nullable: true })
    coachId?: string;

    @Field({ nullable: true })
    isActive?: boolean;

    @Field({ nullable: true })
    search?: string; // Para buscar por nombre o descripción
}