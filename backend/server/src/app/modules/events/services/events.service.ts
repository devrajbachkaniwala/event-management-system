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

@Injectable()
export class EventsService implements IEventsService {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService
  ) {}

  async create(
    orgId: string,
    createEventDto: CreateEventDto
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

          organization: {
            connect: {
              id: orgId
            }
          }
        }
      });

      return EventDtoFactory.create(event);
    } catch (err: any) {
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
}
