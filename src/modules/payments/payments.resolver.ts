import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';
import { PaymentType, ConfirmPaymentResponse } from './dto/graphql.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver(() => PaymentType)
export class PaymentsResolver {
  constructor(private paymentsService: PaymentsService) {}

  @Mutation(() => ConfirmPaymentResponse)
  async confirmPayment(
    @Args('paymentId') paymentId: string,
    @Args('paymentMethod') paymentMethod: string,
    @CurrentUser() user: any,
  ): Promise<ConfirmPaymentResponse> {
    try {
      const payment = await this.paymentsService.confirmPayment(
        paymentId,
        paymentMethod,
        user.id,
      );

      return {
        success: true,
        message: 'Payment confirmed successfully',
        payment: {
          id: payment.id,
          amount: Number(payment.amount),
          status: payment.status,
          paymentMethod: payment.paymentMethod || undefined,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to confirm payment',
        payment: undefined,
      };
    }
  }

  @Query(() => PaymentType, { name: 'getPaymentByBooking' })
  async getPaymentByBooking(
    @Args('bookingId') bookingId: string,
    @CurrentUser() user: any,
  ): Promise<PaymentType> {
    const payment = await this.paymentsService.getPaymentByBookingId(bookingId, user.id);
    return {
      id: payment.id,
      amount: Number(payment.amount),
      status: payment.status,
      paymentMethod: payment.paymentMethod || undefined,
    };
  }
}

