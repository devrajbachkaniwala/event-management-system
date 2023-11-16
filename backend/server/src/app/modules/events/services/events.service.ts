import { Inject, Injectable } from '@nestjs/common';
import { IPrismaApiService, prismaApiServiceToken } from '../../prisma';
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

@Injectable()
export class EventsService implements IEventsService {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService,
    private readonly configService: ConfigService
  ) {}

  async create(
    orgId: string,
    createEventDto: CreateEventDto,
    eventPhotoFiles: Array<Express.Multer.File>
  ): Promise<EventDto> {
    try {
      const event = await this.prisma.event.create({
        data: {
          name: createEventDto.name,
          description: createEventDto.description,
          city: createEventDto.city,
          state: createEventDto.state,
          country: createEventDto.country,
          venue: createEventDto.venue,
          category: createEventDto.category,

          timings: createEventDto.timings.map((t) => ({
            date: t.date,
            startTime: t.startTime,
            endTime: t.endTime
          })),

          prices: createEventDto.prices.map((p) => ({
            price: p.price,
            currency: p.currency,
            maxLimit: p.maxLimit
          })),

          organization: {
            connect: {
              id: orgId
            }
          }
        }
      });

      const photoUrls = eventPhotoFiles.map((p) => ({
        photoUrl: this.generatePhotoUrl(event.id, p.filename)
      }));

      const updateEvent = await this.prisma.event.update({
        where: {
          id: event.id,
          organization: {
            id: orgId
          }
        },
        data: {
          photos: {
            push: photoUrls
          }
        }
      });

      const data: Event = { ...updateEvent };

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
      const events = await this.prisma.event.findMany();

      return events.map(EventDtoFactory.create);
    } catch (err: any) {
      throw EventErrorFactory.create(err, 'Failed to get all events');
    }
  }

  async findOne(eventId: string): Promise<EventDto> {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId
        },
        include: {
          organization: true
        }
      });

      if (!event) {
        throw new EventNotFound();
      }

      return EventDtoFactory.create(event);
    } catch (err: any) {
      throw EventErrorFactory.create(err, 'Failed to get an event');
    }
  }

  async update(orgId: string, eventId: string, updateEventDto: UpdateEventDto) {
    try {
      const event = await this.prisma.event.update({
        where: {
          id: eventId,
          organization: {
            id: orgId
          }
        },
        data: {
          name: updateEventDto.name,
          description: updateEventDto.description,
          city: updateEventDto.city,
          state: updateEventDto.state,
          country: updateEventDto.country,
          venue: updateEventDto.venue,
          category: updateEventDto.category
        }
      });

      return EventDtoFactory.create(event);
    } catch (err: any) {
      throw EventErrorFactory.create(err, 'Failed to update an event');
    }
  }

  async remove(orgId: string, eventId: string): Promise<true> {
    try {
      const event = await this.prisma.event.delete({
        where: {
          id: eventId,
          organization: {
            id: orgId
          }
        }
      });

      return true;
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
