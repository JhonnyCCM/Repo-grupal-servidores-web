import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { User } from '../types/user.type';
import { CreateUserInput, UpdateUserInput, FilterUserInput } from '../inputs/user.input';
import { UserHttpService } from './user-http.service';
import { Observable } from 'rxjs';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userHttpService: UserHttpService) {}

  @Query(() => [User], { name: 'users' })
  findAll(@Args('filter', { type: () => FilterUserInput, nullable: true }) filter?: FilterUserInput): Observable<User[]> {
    return this.userHttpService.findAll(filter);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }) id: string): Observable<User> {
    return this.userHttpService.findOne(id);
  }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput): Observable<User> {
    return this.userHttpService.create(createUserInput);
  }

  @Mutation(() => User)
  updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Observable<User> {
    return this.userHttpService.update(id, updateUserInput);
  }

  @Mutation(() => Boolean)
  removeUser(@Args('id', { type: () => ID }) id: string): Observable<boolean> {
    return this.userHttpService.remove(id);
  }

  // Consultas complejas
  @Query(() => [User], { name: 'usersWithStats' })
  getUsersWithStats(): Observable<any> {
    return this.userHttpService.getUsersWithStats();
  }

  @Query(() => [User], { name: 'activeUsers' })
  getActiveUsers(): Observable<User[]> {
    return this.userHttpService.findAll({ isActive: true });
  }

  @Query(() => [User], { name: 'usersByRole' })
  getUsersByRole(@Args('role') role: string): Observable<User[]> {
    return this.userHttpService.findAll({ role: role as any });
  }
}