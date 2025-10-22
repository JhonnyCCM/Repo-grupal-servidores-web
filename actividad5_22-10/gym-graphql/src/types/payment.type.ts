import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
import { PaymentMethod, PaymentStatus } from '../common/enums';

// Registrar enums para GraphQL
registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});

@ObjectType()
export class Payment {
    @Field(() => ID)
    id: string;

    @Field(() => PaymentMethod)
    method: PaymentMethod;

    @Field(() => Float)
    amount: number;

    @Field({ nullable: true })
    transactionId?: string;

    @Field(() => PaymentStatus)
    status: PaymentStatus;

    @Field({ nullable: true })
    paidAt?: string;

    @Field(() => ID)
    membershipId: string;

    @Field(() => ID)
    userId: string;

    @Field({ nullable: true })
    createdAt?: string;

    @Field({ nullable: true })
    updatedAt?: string;
}
