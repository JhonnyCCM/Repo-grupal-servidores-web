import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class GymClassCategory {
    @Field(() => ID)
    id: string;

    @Field()
    classId: string;

    @Field()
    categoryId: string;

    @Field({ nullable: true })
    createdAt?: string;

    @Field({ nullable: true })
    updatedAt?: string;
}
