import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateCoachInput {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field({ nullable: true })
    biography?: string;

    @Field(() => Int, { defaultValue: 0 })
    experienceYears: number;

    @Field({ nullable: true })
    imageUrl?: string;

    @Field(() => [String], { nullable: true })
    specialities?: string[];
}

@InputType()
export class UpdateCoachInput {
    @Field({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    lastName?: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    password?: string;

    @Field({ nullable: true })
    biography?: string;

    @Field(() => Int, { nullable: true })
    experienceYears?: number;

    @Field({ nullable: true })
    imageUrl?: string;

    @Field(() => [String], { nullable: true })
    specialities?: string[];

    @Field({ nullable: true })
    isActive?: boolean;
}

@InputType()
export class FilterCoachInput {
    @Field({ nullable: true })
    isActive?: boolean;

    @Field({ nullable: true })
    search?: string; // Para buscar por nombre o especialidad

    @Field(() => Int, { nullable: true })
    minExperience?: number;

    @Field({ nullable: true })
    specialty?: string;
}