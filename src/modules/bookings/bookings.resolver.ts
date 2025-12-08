import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BookingsService } from './bookings.service';
import { BookingInput, BookingType, CreateBookingResponse } from './dto/graphql.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver(() => BookingType)
export class BookingsResolver {
  constructor(private bookingsService: BookingsService) {}

  @Mutation(() => CreateBookingResponse)
  async createBooking(
    @Args('input') input: BookingInput,
    @CurrentUser() user: any,
  ): Promise<CreateBookingResponse> {
    try {
      const booking = await this.bookingsService.create(input, user.id);
      return {
        success: true,
        message: 'Booking created successfully',
        booking: this.mapToBookingType(booking),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create booking',
        booking: undefined,
      };
    }
  }

  @Query(() => [BookingType])
  async myBookings(
    @Args('status', { nullable: true }) status: string,
    @CurrentUser() user: any,
  ): Promise<BookingType[]> {
    const bookings = await this.bookingsService.findByUser(user.id, status);
    return bookings.map((b) => this.mapToBookingType(b));
  }

  private mapToBookingType(booking: any): BookingType {
    return {
      id: booking.id,
      checkInDate: booking.checkInDate.toISOString().split('T')[0],
      checkOutDate: booking.checkOutDate.toISOString().split('T')[0],
      guestNames: booking.guestNames || [],
      specialRequests: booking.specialRequests || undefined,
      totalPrice: Number(booking.totalPrice),
      status: booking.status,
      bookingDate: booking.bookingDate,
      durationNights: booking.durationNights,
      isActive: booking.isActive,
      user: booking.user
        ? {
            id: booking.user.id,
            email: booking.user.email,
            fullName: `${booking.user.firstName} ${booking.user.lastName}`,
          }
        : undefined,
      roomUnit: booking.roomUnit
        ? {
            id: booking.roomUnit.id,
            roomNumber: booking.roomUnit.roomNumber,
            roomType: booking.roomUnit.roomType,
            capacity: booking.roomUnit.capacity,
            basePricePerNight: Number(booking.roomUnit.basePricePerNight),
          }
        : undefined,
      property: booking.property
        ? {
            id: booking.property.id,
            name: booking.property.name,
            city: booking.property.city,
            country: booking.property.country,
          }
        : undefined,
      payment: booking.payment
        ? {
            id: booking.payment.id,
            amount: Number(booking.payment.amount),
            status: booking.payment.status,
            paymentMethod: booking.payment.paymentMethod || undefined,
          }
        : undefined,
    };
  }
}

