import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { Inject, forwardRef } from '@nestjs/common';
import { Payment } from '../types/payment.type';
import { User } from '../types/user.type';
import { Membership } from '../types/membership.type';
import { CreatePaymentInput, UpdatePaymentInput, FilterPaymentInput } from '../inputs/payment.input';
import { PaymentHttpService } from './payment-http.service';
import { UserHttpService } from '../user/user-http.service';
import { MembershipHttpService } from '../membership/membership-http.service';
import { Observable, map } from 'rxjs';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(
    private readonly paymentHttpService: PaymentHttpService,
    @Inject(forwardRef(() => UserHttpService))
    private readonly userHttpService: UserHttpService,
    @Inject(forwardRef(() => MembershipHttpService))
    private readonly membershipHttpService: MembershipHttpService,
  ) {}

  @Query(() => [Payment], { name: 'payments' })
  findAll(@Args('filter', { type: () => FilterPaymentInput, nullable: true }) filter?: FilterPaymentInput): Observable<Payment[]> {
    return this.paymentHttpService.findAll(filter);
  }

  @Query(() => Payment, { name: 'payment' })
  findOne(@Args('id', { type: () => ID }) id: string): Observable<Payment> {
    return this.paymentHttpService.findOne(id);
  }

  @Mutation(() => Payment)
  createPayment(@Args('createPaymentInput') createPaymentInput: CreatePaymentInput): Observable<Payment> {
    return this.paymentHttpService.create(createPaymentInput);
  }

  @Mutation(() => Payment)
  updatePayment(
    @Args('id', { type: () => ID }) id: string,
    @Args('updatePaymentInput') updatePaymentInput: UpdatePaymentInput,
  ): Observable<Payment> {
    return this.paymentHttpService.update(id, updatePaymentInput);
  }

  @Mutation(() => Boolean)
  removePayment(@Args('id', { type: () => ID }) id: string): Observable<boolean> {
    return this.paymentHttpService.remove(id);
  }

  // Consultas complejas
  @Query(() => [Payment], { name: 'completedPayments' })
  getCompletedPayments(): Observable<Payment[]> {
    return this.paymentHttpService.findCompletedPayments();
  }

  @Query(() => [Payment], { name: 'pendingPayments' })
  getPendingPayments(): Observable<Payment[]> {
    return this.paymentHttpService.findPendingPayments();
  }

  @Query(() => [Payment], { name: 'paymentsByUser' })
  getPaymentsByUser(@Args('userId', { type: () => ID }) userId: string): Observable<Payment[]> {
    return this.paymentHttpService.findByUserId(userId);
  }

  @Query(() => String, { name: 'paymentStats' })
  getPaymentStats(): Observable<string> {
    return this.paymentHttpService.findAll().pipe(
      map((payments: any[]) => {
        const total = payments.length;
        const completed = payments.filter(p => p.status === 'COMPLETED').length;
        const pending = payments.filter(p => p.status === 'PENDING').length;
        const failed = payments.filter(p => p.status === 'FAILED').length;
        const totalAmount = payments
          .filter(p => p.status === 'COMPLETED')
          .reduce((sum, p) => sum + Number(p.amount || 0), 0);
        
        return `Payment Statistics: Total: ${total}, Completed: ${completed}, Pending: ${pending}, Failed: ${failed}, Total Amount: $${totalAmount.toFixed(2)}`;
      })
    );
  }

  // Relations
  @ResolveField(() => User)
  user(@Parent() payment: Payment): Observable<User> {
    return this.userHttpService.findOne(payment.userId);
  }

  @ResolveField(() => Membership)
  membership(@Parent() payment: Payment): Observable<Membership> {
    return this.membershipHttpService.findOne(payment.membershipId);
  }
}
