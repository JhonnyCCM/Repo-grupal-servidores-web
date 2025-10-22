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

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    imageUrl?: string;
}
