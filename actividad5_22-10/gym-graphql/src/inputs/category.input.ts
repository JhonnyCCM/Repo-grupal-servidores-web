import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;
}

@InputType()
export class UpdateCategoryInput {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    description?: string;
}

@InputType()
export class FilterCategoryInput {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    description?: string;
}