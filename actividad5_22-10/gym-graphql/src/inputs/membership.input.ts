import { InputType, Field, ID } from '@nestjs/graphql';
import { MembershipStatus } from '../common/enums';

@InputType()
export class CreateMembershipInput {
    @Field(() => ID)
    userId: string;

    @Field(() => ID)
    planId: string;

    @Field()
    startDate: Date;

    @Field()
    endDate: Date;

    @Field(() => MembershipStatus, { defaultValue: MembershipStatus.ACTIVE })
    status: MembershipStatus;
}

@InputType()
export class UpdateMembershipInput {
    @Field(() => ID, { nullable: true })
    userId?: string;

    @Field(() => ID, { nullable: true })
    planId?: string;

    @Field({ nullable: true })
    startDate?: Date;

    @Field({ nullable: true })
    endDate?: Date;

    @Field(() => MembershipStatus, { nullable: true })
    status?: MembershipStatus;
}

@InputType()
export class FilterMembershipInput {
    @Field(() => ID, { nullable: true })
    userId?: string;

    @Field(() => ID, { nullable: true })
    planId?: string;

    @Field(() => MembershipStatus, { nullable: true })
    status?: MembershipStatus;
}
