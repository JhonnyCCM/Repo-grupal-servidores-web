import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Room {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Int)
    capacity: number;

    @Field({ nullable: true })
    createdAt?: string;

    @Field({ nullable: true })
    updatedAt?: string;
}
