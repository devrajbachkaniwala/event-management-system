import { Inject, Injectable } from '@nestjs/common';
import { IEventDao, TEventPhotos } from './event-dao.interface';
import { IPrismaApiService, prismaApiServiceToken } from '../../prisma';
import { CreateEventDto, UpdateEventDto } from '../../events';
import { DaoError } from '../errors/dao.error';
import { Event } from '@prisma/client';

@Injectable()
export class EventDaoImpl implements IEventDao {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService
  ) {}

  async create(orgId: string, createEventDto: CreateEventDto): Promise<Event> {
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

      return event;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async findAll(): Promise<Event[]> {
    try {
      const events = await this.prisma.event.findMany();
      return events;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async findOne(eventId: string): Promise<Event> {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId
        },
        include: {
          organization: true
        }
      });
      return event;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async update(
    orgId: string,
    eventId: string,
    updateEventDto: UpdateEventDto & Partial<TEventPhotos>
  ): Promise<Event> {
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
          category: updateEventDto.category,

          timings: updateEventDto.timings?.map((t) => ({
            date: t.date,
            startTime: t.startTime,
            endTime: t.endTime
          })),

          prices: updateEventDto.prices?.map((p) => ({
            price: p.price,
            currency: p.currency,
            maxLimit: p.maxLimit
          })),

          photos: {
            push: updateEventDto.photoUrls?.map((url) => ({ photoUrl: url }))
          }
        }
      });
      return event;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async remove(orgId: string, eventId: string): Promise<boolean> {
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
      throw new DaoError(err.message);
    }
  }
}
