import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { DifficultyLevel } from '../common/enums';

// Registrar enum para GraphQL
registerEnumType(DifficultyLevel, {
  name: 'DifficultyLevel',
});

@ObjectType()
export class GymClass {
    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    createdAt?: string;

    @Field({ nullable: true })
    updatedAt?: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => ID)
    coachId: string;

    @Field(() => DifficultyLevel)
    difficultyLevel: DifficultyLevel;

    @Field()
    isActive: boolean;

    @Field({ nullable: true })
    imageUrl?: string;

    @Field(() => ID, { nullable: true })
    scheduleId?: string;

    @Field(() => ID, { nullable: true })
    roomId?: string;

    // Relations (will be resolved by resolvers)
    // coach?: Coach;
    // schedule?: Schedule;
    // room?: Room;
    // enrollments?: ClassEnrollment[];
}
