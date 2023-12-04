import { Inject, Injectable } from '@nestjs/common';
import { EventErrorFactory, EventNotFound } from '../errors';
import {
  CreateEventDto,
  EventDto,
  EventDtoFactory,
  UpdateEventDto
} from '../dto';
import { IEventsService } from './events-service.interface';
import { Event } from '@prisma/client';
import {
  EventPhotoDtoFactory,
  EventPriceDtoFactory,
  EventTimingDtoFactory
} from '../modules';
import { ConfigService } from '@nestjs/config';
import {
  IDaoFactory,
  daoFactoryToken
} from '../../dao/dao-factory/dao-factory.interface';
import { IEventDao } from '../../dao/event-dao/event-dao.interface';

@Injectable()
export class EventsService implements IEventsService {
  private eventDao: IEventDao;

  constructor(
    @Inject(daoFactoryToken) daoFactory: IDaoFactory,
    private readonly configService: ConfigService
  ) {
    this.eventDao = daoFactory.getEventDao();
  }

  async create(
    orgId: string,
    createEventDto: CreateEventDto,
    eventPhotoFiles: Array<Express.Multer.File>
  ): Promise<EventDto> {
    try {
      const newEvent = await this.eventDao.create(orgId, createEventDto);

      const photoUrls: string[] = eventPhotoFiles.map((p) =>
        this.generatePhotoUrl(newEvent.id, p.filename)
      );

      let updatedEventWithPhotos: EventDto;

      try {
        updatedEventWithPhotos = await this.eventDao.update(
          orgId,
          newEvent.id,
          { photoUrls }
        );
      } catch (err: any) {
        await this.remove(newEvent.orgId, newEvent.id);
        throw err;
      }

      const data: Event = { ...updatedEventWithPhotos };

      data.timings = data.timings.map(EventTimingDtoFactory.create);
      data.prices = data.prices.map(EventPriceDtoFactory.create);
      data.photos = data.photos.map(EventPhotoDtoFactory.create);

      return EventDtoFactory.create(data);
    } catch (err: any) {
      console.log(err);
      throw EventErrorFactory.create(err, 'Failed to create an event');
    }
  }

  async findAll(): Promise<EventDto[]> {
    try {
      const events = await this.eventDao.findAll();

      return events.map(EventDtoFactory.create);
    } catch (err: any) {
      console.log(err);
      throw EventErrorFactory.create(err, 'Failed to get all events');
    }
  }

  async findOne(eventId: string): Promise<EventDto> {
    try {
      const event = await this.eventDao.findOne(eventId);

      if (!event) {
        throw new EventNotFound();
      }

      return EventDtoFactory.create(event);
    } catch (err: any) {
      console.log(err);
      throw EventErrorFactory.create(err, 'Failed to get an event');
    }
  }

  async update(
    orgId: string,
    eventId: string,
    updateEventDto: UpdateEventDto,
    eventPhotoFiles?: Array<Express.Multer.File>
  ) {
    try {
      const photoUrls: string[] = eventPhotoFiles?.map((p) =>
        this.generatePhotoUrl(eventId, p.filename)
      );

      const event = await this.eventDao.update(orgId, eventId, {
        ...updateEventDto,
        photoUrls
      });

      const data: Event = { ...event };

      data.timings = data.timings.map(EventTimingDtoFactory.create);
      data.prices = data.prices.map(EventPriceDtoFactory.create);
      data.photos = data.photos.map(EventPhotoDtoFactory.create);

      return EventDtoFactory.create(data);
    } catch (err: any) {
      console.log(err);
      throw EventErrorFactory.create(err, 'Failed to update an event');
    }
  }

  async remove(orgId: string, eventId: string): Promise<boolean> {
    try {
      const isDeleted = await this.eventDao.remove(orgId, eventId);

      return isDeleted;
    } catch (err: any) {
      console.log(err);
      throw EventErrorFactory.create(err, 'Failed to delete an event');
    }
  }

  private generatePhotoUrl(eventId: string, filename: string): string {
    return `${this.configService.get(
      'SERVER_URL'
    )}/v1/events/${eventId}/photos/${filename}`;
  }
}
