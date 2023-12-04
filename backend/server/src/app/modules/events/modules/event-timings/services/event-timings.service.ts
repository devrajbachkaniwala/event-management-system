import { Inject, Injectable } from '@nestjs/common';
import { IEventTimingsService } from './event-timings-service.interface';
import {
  CreateEventTimingDto,
  EventTimingDto,
  EventTimingDtoFactory,
  UpdateEventTimingDto
} from '../dto';
import { EventTimingErrorFactory, EventTimingNotFound } from '../errors';
import {
  IDaoFactory,
  daoFactoryToken
} from 'src/app/modules/dao/dao-factory/dao-factory.interface';
import { IEventTimingDao } from 'src/app/modules/dao/event-timing-dao/event-timing-dao.interface';

@Injectable()
export class EventTimingsService implements IEventTimingsService {
  private eventTimingDao: IEventTimingDao;

  constructor(@Inject(daoFactoryToken) daoFactory: IDaoFactory) {
    this.eventTimingDao = daoFactory.getEventTimingDao();
  }

  async create(
    orgId: string,
    eventId: string,
    createEventTimingDto: CreateEventTimingDto
  ): Promise<EventTimingDto> {
    try {
      const timing = await this.eventTimingDao.create(
        orgId,
        eventId,
        createEventTimingDto
      );

      return EventTimingDtoFactory.create(timing);
    } catch (err: any) {
      throw EventTimingErrorFactory.create(
        err,
        'Failed to create an event timing'
      );
    }
  }

  async findAll(eventId: string): Promise<EventTimingDto[]> {
    try {
      const timings = await this.eventTimingDao.findAll(eventId);

      return timings.map(EventTimingDtoFactory.create);
    } catch (err: any) {
      throw EventTimingErrorFactory.create(
        err,
        'Failed to get all event timings'
      );
    }
  }

  async findOne(eventId: string, timingId: string): Promise<EventTimingDto> {
    try {
      const eventTiming = await this.eventTimingDao.findOne(eventId, timingId);

      if (!eventTiming) {
        throw new EventTimingNotFound();
      }

      return EventTimingDtoFactory.create(eventTiming);
    } catch (err: any) {
      throw EventTimingErrorFactory.create(
        err,
        'Failed to get an event timing'
      );
    }
  }

  async update(
    orgId: string,
    eventId: string,
    timingId: string,
    updateEventTimingDto: UpdateEventTimingDto
  ): Promise<EventTimingDto> {
    try {
      const eventTiming = await this.eventTimingDao.update(
        orgId,
        eventId,
        timingId,
        updateEventTimingDto
      );

      if (!eventTiming) {
        throw new EventTimingNotFound();
      }

      return EventTimingDtoFactory.create(eventTiming);
    } catch (err: any) {
      throw EventTimingErrorFactory.create(
        err,
        'Failed to update an event timing'
      );
    }
  }

  async remove(
    orgId: string,
    eventId: string,
    timingId: string
  ): Promise<boolean> {
    try {
      const timing = await this.eventTimingDao.remove(orgId, eventId, timingId);

      return true;
    } catch (err: any) {
      throw EventTimingErrorFactory.create(
        err,
        'Failed to delete an event timing'
      );
    }
  }
}
