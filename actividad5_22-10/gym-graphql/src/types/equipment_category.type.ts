import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class EquipmentCategory {
    @Field(() => ID)
    id: string;

    @Field()
    equipmentId: string;

    @Field()
    categoryId: string;

    @Field({ nullable: true })
    createdAt?: string;

    @Field({ nullable: true })
    updatedAt?: string;
}
