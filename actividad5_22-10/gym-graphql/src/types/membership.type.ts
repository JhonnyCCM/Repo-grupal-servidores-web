import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { MembershipStatus } from '../common/enums';

// Registrar enum para GraphQL
registerEnumType(MembershipStatus, {
  name: 'MembershipStatus',
});

@ObjectType()
export class Membership {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    userId: string;

    @Field(() => ID)
    planId: string;

    @Field(() => MembershipStatus)
    status: MembershipStatus;

    @Field({ nullable: true })
    startDate?: string;

    @Field({ nullable: true })
    endDate?: string;

    @Field({ nullable: true })
    createdAt?: string;

    @Field({ nullable: true })
    updatedAt?: string;
}
