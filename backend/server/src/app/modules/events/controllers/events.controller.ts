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
import { IEventsService, eventsServiceToken } from '../services';
import { CreateEventDto, EventDto, UpdateEventDto } from '../dto';
import { ResErrorDtoFactory, ResSuccessDtoFactory } from 'src/app/dto';
import { GetOrgId, Public, Roles } from 'src/app/decorators';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/app/guards';

@Controller({ path: 'events', version: '1' })
export class EventsController {
  constructor(
    @Inject(eventsServiceToken) private readonly eventsService: IEventsService
  ) {}

  @Post()
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async create(
    @GetOrgId() orgId: string,
    @Body() createEventDto: CreateEventDto
  ) {
    let eventDto: EventDto = null;
    try {
      eventDto = await this.eventsService.create(orgId, createEventDto);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to create an event');
    }

    return ResSuccessDtoFactory.create(eventDto);
  }

  @Get()
  @Public()
  async findAll() {
    let events: EventDto[] = null;
    try {
      events = await this.eventsService.findAll();
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get all events');
    }

    return ResSuccessDtoFactory.create(events);
  }

  @Get(':event_id')
  @Public()
  async findOne(@Param('event_id') eventId: string) {
    let event: EventDto = null;
    try {
      event = await this.eventsService.findOne(eventId);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get an event');
    }

    return ResSuccessDtoFactory.create(event);
  }

  @Patch(':event_id')
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async update(
    @GetOrgId() orgId: string,
    @Param('event_id') eventId: string,
    @Body() updateEventDto: UpdateEventDto
  ) {
    let event: EventDto = null;
    try {
      event = await this.eventsService.update(orgId, eventId, updateEventDto);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to update an event');
    }

    return ResSuccessDtoFactory.create(event);
  }

  @Delete(':event_id')
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async remove(@GetOrgId() orgId: string, @Param('event_id') eventId: string) {
    let isDeleted: boolean = false;
    try {
      isDeleted = await this.eventsService.remove(orgId, eventId);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to delete an event');
    }

    return ResSuccessDtoFactory.create({
      message: 'Successfully deleted an event'
    });
  }
}
