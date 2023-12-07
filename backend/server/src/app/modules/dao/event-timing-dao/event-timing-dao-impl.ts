import { Inject } from '@nestjs/common';
import { CreateEventTimingDto, UpdateEventTimingDto } from '../../events';
import { IEventTimingDao } from './event-timing-dao.interface';
import { IPrismaApiService, prismaApiServiceToken } from '../../prisma';
import { DaoError } from '../errors/dao.error';
import { EventTiming } from '@prisma/client';

export class EventTimingDaoImpl implements IEventTimingDao {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService
  ) {}

  async create(
    orgId: string,
    eventId: string,
    createEventTimingDto: CreateEventTimingDto
  ): Promise<EventTiming> {
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

      return event.timings.pop();
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async findAll(eventId: string): Promise<EventTiming[]> {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId
        }
      });
      return event.timings;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async findOne(eventId: string, timingId: string): Promise<EventTiming> {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId
        }
      });

      return event.timings.find((t) => t.id === timingId);
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async update(
    orgId: string,
    eventId: string,
    timingId: string,
    updateEventTimingDto: UpdateEventTimingDto
  ): Promise<EventTiming> {
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

      return event.timings.find((t) => t.id === timingId);
    } catch (err: any) {
      throw new DaoError(err.message);
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
      throw new DaoError(err.message);
    }
  }
}
