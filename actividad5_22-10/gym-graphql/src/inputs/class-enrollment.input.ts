import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateClassEnrollmentInput {
    @Field(() => ID)
    userId: string;

    @Field(() => ID)
    classId: string;

    @Field()
    enrollmentDate: Date;
}

@InputType()
export class UpdateClassEnrollmentInput {
    @Field(() => ID, { nullable: true })
    userId?: string;

    @Field(() => ID, { nullable: true })
    classId?: string;

    @Field({ nullable: true })
    enrollmentDate?: Date;
}

@InputType()
export class FilterClassEnrollmentInput {
    @Field(() => ID, { nullable: true })
    userId?: string;

    @Field(() => ID, { nullable: true })
    classId?: string;
}
