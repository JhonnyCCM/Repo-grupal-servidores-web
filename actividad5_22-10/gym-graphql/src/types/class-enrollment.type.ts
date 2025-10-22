import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ClassEnrollment {
    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    enrollmentDate?: string;

    @Field(() => ID)
    userId: string;

    @Field(() => ID)
    classId: string;

    @Field({ nullable: true })
    createdAt?: string;

    @Field({ nullable: true })
    updatedAt?: string;
}
