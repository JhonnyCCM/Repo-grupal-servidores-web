import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEquipmentCategoryInput {
    @Field()
    equipmentId: string;

    @Field()
    categoryId: string;
}

@InputType()
export class UpdateEquipmentCategoryInput {
    @Field({ nullable: true })
    equipmentId?: string;

    @Field({ nullable: true })
    categoryId?: string;
}

@InputType()
export class FilterEquipmentCategoryInput {
    @Field({ nullable: true })
    equipmentId?: string;

    @Field({ nullable: true })
    categoryId?: string;
}