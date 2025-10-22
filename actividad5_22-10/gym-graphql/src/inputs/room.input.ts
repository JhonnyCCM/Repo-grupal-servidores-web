import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateRoomInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Int)
    capacity: number;
}

@InputType()
export class UpdateRoomInput {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Int, { nullable: true })
    capacity?: number;
}

@InputType()
export class FilterRoomInput {
    @Field({ nullable: true })
    search?: string;

    @Field(() => Int, { nullable: true })
    minCapacity?: number;

    @Field(() => Int, { nullable: true })
    maxCapacity?: number;
}
