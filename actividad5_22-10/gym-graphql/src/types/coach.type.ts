import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Coach {
    @Field(() => ID)
    id: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    biography?: string;

    @Field(() => Int)
    experienceYears: number;

    @Field()
    isActive: boolean;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    imageUrl?: string;

    @Field(() => [String], { nullable: true })
    specialities?: string[];
}
