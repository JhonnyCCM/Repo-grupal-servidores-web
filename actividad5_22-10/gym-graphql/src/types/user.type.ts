import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '../common/enums';

// Registrar enum para GraphQL
registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

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

    @Field()
    isActive: boolean;

    @Field({ nullable: true })
    createdAt?: string;

    @Field({ nullable: true })
    updatedAt?: string;

    @Field(() => UserRole)
    role: UserRole;

    // Relations (will be resolved by resolvers)
    // memberships?: Membership[];
    // payments?: Payment[];
    // enrollments?: ClassEnrollment[];
}