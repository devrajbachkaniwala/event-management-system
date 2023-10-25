import { Inject, Injectable } from '@nestjs/common';
import { IEventTimingsService } from './event-timings-service.interface';
import {
  CreateEventTimingDto,
  EventTimingDto,
  EventTimingDtoFactory,
  UpdateEventTimingDto
} from '../dto';
import {
  IPrismaApiService,
  prismaApiServiceToken
} from 'src/app/modules/prisma';
import { EventTimingErrorFactory, EventTimingNotFound } from '../errors';

@Injectable()
export class EventTimingsService implements IEventTimingsService {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService
  ) {}

  async create(
    orgId: string,
    eventId: string,
    createEventTimingDto: CreateEventTimingDto
  ): Promise<EventTimingDto> {
    try {
      const event = await this.prisma.event.update({
        where: {
          id: eventId,
          organization: {
            id: orgId
          }
        },
        data: {
          timings: {
            push: {
              date: createEventTimingDto.date,
              startTime: createEventTimingDto.startTime,
              endTime: createEventTimingDto.endTime
            }
          }
        }
      });

      return EventTimingDtoFactory.create(event.timings.pop());
    } catch (err: any) {
      throw EventTimingErrorFactory.create(
        err,
        'Failed to create an event timing'
      );
    }
  }

  async findAll(eventId: string): Promise<EventTimingDto[]> {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId
        }
      });

      return event.timings.map(EventTimingDtoFactory.create);
    } catch (err: any) {
      throw EventTimingErrorFactory.create(
        err,
        'Failed to get all event timings'
      );
    }
  }

  async findOne(eventId: string, timingId: string): Promise<EventTimingDto> {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId
        }
      });

      const eventTiming = event.timings.find((t) => t.id === timingId);

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
      const event = await this.prisma.event.update({
        where: {
          id: eventId,
          organization: {
            id: orgId
          }
        },
        data: {
          timings: {
            updateMany: {
              where: {
                id: timingId
              },
              data: {
                date: updateEventTimingDto.date,
                startTime: updateEventTimingDto.startTime,
                endTime: updateEventTimingDto.endTime
              }
            }
          }
        }
      });

      const eventTiming = event.timings.find((t) => t.id === timingId);

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
      const event = await this.prisma.event.update({
        where: {
          id: eventId,
          organization: {
            id: orgId
          }
        },
        data: {
          timings: {
            deleteMany: {
              where: {
                id: timingId
              }
            }
          }
        }
      });

      return true;
    } catch (err: any) {
      throw EventTimingErrorFactory.create(
        err,
        'Failed to delete an event timing'
      );
    }
  }
}
