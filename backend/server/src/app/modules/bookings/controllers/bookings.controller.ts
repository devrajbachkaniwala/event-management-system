import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  Query,
  ParseArrayPipe,
  UseGuards
} from '@nestjs/common';
import { IBookingsService, bookingsServiceToken } from '../services';
import { BookingDto, CreateBookingDto } from '../dto';
import { GetUserId, Roles } from 'src/app/decorators';
import { ResErrorDtoFactory, ResSuccessDtoFactory } from 'src/app/dto';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/app/guards';

@Controller({ path: 'bookings', version: '1' })
export class BookingsController {
  constructor(
    @Inject(bookingsServiceToken)
    private readonly bookingsService: IBookingsService
  ) {}

  @Post()
  @Roles([Role.USER, Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async create(
    @GetUserId() userId: string,
    @Body() createBookingDto: CreateBookingDto
  ) {
    let booking: BookingDto = null;
    try {
      booking = await this.bookingsService.create(userId, createBookingDto);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to create booking');
    }

    return ResSuccessDtoFactory.create(booking);
  }

  @Get()
  @Roles([Role.USER, Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async findAll(
    @GetUserId() userId: string,
    @Query(
      'include',
      new ParseArrayPipe({
        optional: true,
        items: String,
        separator: ','
      })
    )
    includes: string[]
  ) {
    let bookings: BookingDto[] = null;
    try {
      bookings = await this.bookingsService.findAll(userId, includes);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, `Failed to get all user's bookings`);
    }

    return ResSuccessDtoFactory.create(bookings);
  }

  @Get(':booking_id')
  @Roles([Role.USER, Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async findOne(
    @GetUserId() userId: string,
    @Param('booking_id') bookingId: string,
    @Query(
      'include',
      new ParseArrayPipe({
        optional: true,
        items: String,
        separator: ','
      })
    )
    includes: string[]
  ) {
    let booking: BookingDto = null;
    try {
      booking = await this.bookingsService.findOne(userId, bookingId, includes);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get booking');
    }
    return ResSuccessDtoFactory.create(booking);
  }

  @Patch(':booking_id/cancel')
  @Roles([Role.USER, Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async cancelBooking(
    @GetUserId() userId: string,
    @Param('booking_id') bookingId: string
    // @Body() updateBookingDto: UpdateBookingDto
  ) {
    let isBookingCanceled: boolean = false;
    try {
      isBookingCanceled = await this.bookingsService.cancelBooking(
        userId,
        bookingId
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to cancel booking');
    }
    return ResSuccessDtoFactory.create({
      message: 'Successfully canceled the booking'
    });
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.bookingsService.remove(+id);
  // }
}
