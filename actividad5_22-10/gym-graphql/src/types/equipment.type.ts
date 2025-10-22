import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Status } from '../common/enums';

// Registrar enum para GraphQL
registerEnumType(Status, {
  name: 'EquipmentStatus',
});

@ObjectType()
export class Equipment {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Status)
    status: Status;

    @Field({ nullable: true })
    createdAt?: string;

    @Field({ nullable: true })
    updatedAt?: string;

    @Field({ nullable: true })
    imageUrl?: string;
}
