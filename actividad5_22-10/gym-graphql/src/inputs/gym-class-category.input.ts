import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateGymClassCategoryInput {
    @Field()
    classId: string;

    @Field()
    categoryId: string;
}

@InputType()
export class UpdateGymClassCategoryInput {
    @Field({ nullable: true })
    classId?: string;

    @Field({ nullable: true })
    categoryId?: string;
}

@InputType()
export class FilterGymClassCategoryInput {
    @Field({ nullable: true })
    classId?: string;

    @Field({ nullable: true })
    categoryId?: string;
}