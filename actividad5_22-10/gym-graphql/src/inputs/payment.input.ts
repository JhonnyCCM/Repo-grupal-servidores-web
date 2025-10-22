import { InputType, Field, ID, Float } from '@nestjs/graphql';
import { PaymentMethod, PaymentStatus } from '../common/enums';

@InputType()
export class CreatePaymentInput {
    @Field(() => PaymentMethod)
    method: PaymentMethod;

    @Field(() => Float)
    amount: number;

    @Field({ nullable: true })
    transactionId?: string;

    @Field(() => ID)
    membershipId: string;

    @Field(() => ID)
    userId: string;

    @Field(() => PaymentStatus, { defaultValue: PaymentStatus.PENDING })
    status: PaymentStatus;
}

@InputType()
export class UpdatePaymentInput {
    @Field(() => PaymentMethod, { nullable: true })
    method?: PaymentMethod;

    @Field(() => Float, { nullable: true })
    amount?: number;

    @Field({ nullable: true })
    transactionId?: string;

    @Field(() => PaymentStatus, { nullable: true })
    status?: PaymentStatus;

    @Field({ nullable: true })
    paidAt?: Date;
}

@InputType()
export class FilterPaymentInput {
    @Field(() => ID, { nullable: true })
    userId?: string;

    @Field(() => ID, { nullable: true })
    membershipId?: string;

    @Field(() => PaymentStatus, { nullable: true })
    status?: PaymentStatus;

    @Field(() => PaymentMethod, { nullable: true })
    method?: PaymentMethod;
}
