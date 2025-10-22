import { InputType, Field } from '@nestjs/graphql';
import { UserRole } from '../common/enums';

@InputType()
export class CreateUserInput {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field({ nullable: true })
    imageUrl?: string;

    @Field(() => UserRole, { defaultValue: UserRole.USER })
    role: UserRole;
}

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    lastName?: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    password?: string;

    @Field({ nullable: true })
    imageUrl?: string;

    @Field(() => UserRole, { nullable: true })
    role?: UserRole;

    @Field({ nullable: true })
    isActive?: boolean;
}

@InputType()
export class FilterUserInput {
    @Field({ nullable: true })
    role?: UserRole;

    @Field({ nullable: true })
    isActive?: boolean;

    @Field({ nullable: true })
    search?: string; // Para buscar por nombre o email
}