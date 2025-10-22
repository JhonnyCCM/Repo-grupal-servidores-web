import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Schedule {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    startTime: string;

    @Field()
    endTime: string;

    @Field({ nullable: true })
    createdAt?: string;

    @Field({ nullable: true })
    updatedAt?: string;
}
