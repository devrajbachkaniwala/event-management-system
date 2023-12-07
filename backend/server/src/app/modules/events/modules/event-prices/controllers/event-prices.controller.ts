import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards
} from '@nestjs/common';
import {
  CreateEventPriceDto,
  EventPriceDto,
  UpdateEventPriceDto
} from '../dto';
import { IEventPricesService, eventPricesServiceToken } from '../services';
import { GetOrgId, Public, Roles } from 'src/app/decorators';
import { ResErrorDtoFactory, ResSuccessDtoFactory } from 'src/app/dto';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/app/guards';

@Controller({ path: 'prices', version: '1' })
export class EventPricesController {
  constructor(
    @Inject(eventPricesServiceToken)
    private readonly eventPricesService: IEventPricesService
  ) {}

  @Post()
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async create(
    @GetOrgId() orgId: string,
    @Param('event_id') eventId: string,
    @Body() createEventPriceDto: CreateEventPriceDto
  ) {
    let eventPriceDto: EventPriceDto = null;
    try {
      eventPriceDto = await this.eventPricesService.create(
        orgId,
        eventId,
        createEventPriceDto
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to create an event price');
    }

    return ResSuccessDtoFactory.create(eventPriceDto);
  }

  @Get()
  @Public()
  async findAll(@Param('event_id') eventId: string) {
    let eventPrices: EventPriceDto[] = null;
    try {
      eventPrices = await this.eventPricesService.findAll(eventId);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get all event prices');
    }

    return ResSuccessDtoFactory.create(eventPrices);
  }

  @Get(':price_id')
  @Public()
  async findOne(
    @Param('event_id') eventId: string,
    @Param('price_id') priceId: string
  ) {
    let eventPriceDto: EventPriceDto = null;
    try {
      eventPriceDto = await this.eventPricesService.findOne(eventId, priceId);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get an event price');
    }

    return ResSuccessDtoFactory.create(eventPriceDto);
  }

  @Patch(':price_id')
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async update(
    @GetOrgId() orgId: string,
    @Param('event_id') eventId: string,
    @Param('price_id') priceId: string,
    @Body() updateEventPriceDto: UpdateEventPriceDto
  ) {
    let eventPriceDto: EventPriceDto = null;
    try {
      eventPriceDto = await this.eventPricesService.update(
        orgId,
        eventId,
        priceId,
        updateEventPriceDto
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to update an event price');
    }

    return ResSuccessDtoFactory.create(eventPriceDto);
  }

  @Delete(':price_id')
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async remove(
    @GetOrgId() orgId: string,
    @Param('event_id') eventId: string,
    @Param('price_id') priceId: string
  ) {
    let isDeleted: boolean = false;
    try {
      isDeleted = await this.eventPricesService.remove(orgId, eventId, priceId);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to delete an event price');
    }

    return ResSuccessDtoFactory.create({
      message: 'Successfully deleted an event price'
    });
  }
}
