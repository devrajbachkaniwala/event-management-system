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
import { IEventTimingsService, eventTimingsServiceToken } from '../services';
import {
  CreateEventTimingDto,
  EventTimingDto,
  UpdateEventTimingDto
} from '../dto';
import { GetOrgId, Public, Roles } from 'src/app/decorators';
import { ResErrorDtoFactory, ResSuccessDtoFactory } from 'src/app/dto';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/app/guards';

@Controller({ path: 'timings', version: '1' })
export class EventTimingsController {
  constructor(
    @Inject(eventTimingsServiceToken)
    private readonly eventTimingsService: IEventTimingsService
  ) {}

  @Post()
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async create(
    @GetOrgId() orgId: string,
    @Param('event_id') eventId: string,
    @Body() createEventTimingDto: CreateEventTimingDto
  ) {
    let eventTimingDto: EventTimingDto = null;
    try {
      eventTimingDto = await this.eventTimingsService.create(
        orgId,
        eventId,
        createEventTimingDto
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to create an event timing');
    }

    return ResSuccessDtoFactory.create(eventTimingDto);
  }

  @Get()
  @Public()
  async findAll(@Param('event_id') eventId: string) {
    let timings: EventTimingDto[] = null;
    try {
      timings = await this.eventTimingsService.findAll(eventId);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get all event timings');
    }

    return ResSuccessDtoFactory.create(timings);
  }

  @Get(':timing_id')
  @Public()
  async findOne(
    @Param('event_id') eventId: string,
    @Param('timing_id') timingId: string
  ) {
    let eventTimingDto: EventTimingDto = null;
    try {
      eventTimingDto = await this.eventTimingsService.findOne(
        eventId,
        timingId
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get an event timing');
    }

    return ResSuccessDtoFactory.create(eventTimingDto);
  }

  @Patch(':timing_id')
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async update(
    @GetOrgId() orgId: string,
    @Param('event_id') eventId: string,
    @Param('timing_id') timingId: string,
    @Body() updateEventTimingDto: UpdateEventTimingDto
  ) {
    let eventTimingDto: EventTimingDto = null;
    try {
      eventTimingDto = await this.eventTimingsService.update(
        orgId,
        eventId,
        timingId,
        updateEventTimingDto
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to update an event timing');
    }

    return ResSuccessDtoFactory.create(eventTimingDto);
  }

  @Delete(':timing_id')
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async remove(
    @GetOrgId() orgId: string,
    @Param('event_id') eventId: string,
    @Param('timing_id') timingId: string
  ) {
    let isDeleted: boolean = false;
    try {
      isDeleted = await this.eventTimingsService.remove(
        orgId,
        eventId,
        timingId
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to delete an event timing');
    }

    return ResSuccessDtoFactory.create({
      message: 'Successfully deleted an event timing'
    });
  }
}
