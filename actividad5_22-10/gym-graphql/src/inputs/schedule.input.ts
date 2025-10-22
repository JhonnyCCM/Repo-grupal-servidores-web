import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateScheduleInput {
    @Field()
    name: string;

    @Field()
    startTime: string;

    @Field()
    endTime: string;
}

@InputType()
export class UpdateScheduleInput {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    startTime?: string;

    @Field({ nullable: true })
    endTime?: string;
}

@InputType()
export class FilterScheduleInput {
    @Field({ nullable: true })
    search?: string;
}
