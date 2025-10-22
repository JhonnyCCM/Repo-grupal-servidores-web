import { InputType, Field } from '@nestjs/graphql';
import { Status } from '../common/enums';

@InputType()
export class CreateEquipmentInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Status, { defaultValue: Status.ACTIVE })
    status: Status;

    @Field({ nullable: true })
    imageUrl?: string;
}

@InputType()
export class UpdateEquipmentInput {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Status, { nullable: true })
    status?: Status;

    @Field({ nullable: true })
    imageUrl?: string;
}

@InputType()
export class FilterEquipmentInput {
    @Field(() => Status, { nullable: true })
    status?: Status;

    @Field({ nullable: true })
    search?: string; // Para buscar por nombre o descripción
}