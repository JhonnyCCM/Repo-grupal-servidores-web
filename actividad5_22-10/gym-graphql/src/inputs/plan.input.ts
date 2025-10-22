import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreatePlanInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Float)
    price: number;

    @Field(() => Int)
    durationInMonths: number;

    @Field(() => [String], { nullable: true })
    features?: string[];

    @Field({ nullable: true, defaultValue: true })
    isActive?: boolean;
}

@InputType()
export class UpdatePlanInput {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Float, { nullable: true })
    price?: number;

    @Field(() => Int, { nullable: true })
    durationInMonths?: number;

    @Field(() => [String], { nullable: true })
    features?: string[];

    @Field({ nullable: true })
    isActive?: boolean;
}

@InputType()
export class FilterPlanInput {
    @Field({ nullable: true })
    search?: string;

    @Field({ nullable: true })
    isActive?: boolean;

    @Field(() => Float, { nullable: true })
    minPrice?: number;

    @Field(() => Float, { nullable: true })
    maxPrice?: number;
}
