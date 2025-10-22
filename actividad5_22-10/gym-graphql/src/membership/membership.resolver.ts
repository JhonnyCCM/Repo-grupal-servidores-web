import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { Inject, forwardRef } from '@nestjs/common';
import { Membership } from '../types/membership.type';
import { User } from '../types/user.type';
import { Plan } from '../types/plan.type';
import { CreateMembershipInput, UpdateMembershipInput, FilterMembershipInput } from '../inputs/membership.input';
import { MembershipHttpService } from './membership-http.service';
import { UserHttpService } from '../user/user-http.service';
import { PlanHttpService } from '../plan/plan-http.service';
import { Observable } from 'rxjs';

@Resolver(() => Membership)
export class MembershipResolver {
  constructor(
    private readonly membershipHttpService: MembershipHttpService,
    @Inject(forwardRef(() => UserHttpService))
    private readonly userHttpService: UserHttpService,
    @Inject(forwardRef(() => PlanHttpService))
    private readonly planHttpService: PlanHttpService,
  ) {}

  @Query(() => [Membership], { name: 'memberships' })
  findAll(@Args('filter', { type: () => FilterMembershipInput, nullable: true }) filter?: FilterMembershipInput): Observable<Membership[]> {
    return this.membershipHttpService.findAll(filter);
  }

  @Query(() => Membership, { name: 'membership' })
  findOne(@Args('id', { type: () => ID }) id: string): Observable<Membership> {
    return this.membershipHttpService.findOne(id);
  }

  @Mutation(() => Membership)
  createMembership(@Args('createMembershipInput') createMembershipInput: CreateMembershipInput): Observable<Membership> {
    return this.membershipHttpService.create(createMembershipInput);
  }

  @Mutation(() => Membership)
  updateMembership(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateMembershipInput') updateMembershipInput: UpdateMembershipInput,
  ): Observable<Membership> {
    return this.membershipHttpService.update(id, updateMembershipInput);
  }

  @Mutation(() => Boolean)
  removeMembership(@Args('id', { type: () => ID }) id: string): Observable<boolean> {
    return this.membershipHttpService.remove(id);
  }

  // Consultas complejas
  @Query(() => [Membership], { name: 'activeMemberships' })
  getActiveMemberships(): Observable<Membership[]> {
    return this.membershipHttpService.findActiveMemberships();
  }

  @Query(() => [Membership], { name: 'membershipsByUser' })
  getMembershipsByUser(@Args('userId', { type: () => ID }) userId: string): Observable<Membership[]> {
    return this.membershipHttpService.findByUserId(userId);
  }

  @Query(() => [Membership], { name: 'expiredMemberships' })
  getExpiredMemberships(): Observable<Membership[]> {
    return this.membershipHttpService.findExpiredMemberships();
  }

  // Relations
  @ResolveField(() => User)
  user(@Parent() membership: Membership): Observable<User> {
    return this.userHttpService.findOne(membership.userId);
  }

  @ResolveField(() => Plan)
  plan(@Parent() membership: Membership): Observable<Plan> {
    return this.planHttpService.findOne(membership.planId);
  }
}
