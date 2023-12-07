import { Inject } from '@nestjs/common';
import { CreateEventPriceDto, UpdateEventPriceDto } from '../../events';
import { IEventPriceDao } from './event-price-dao.interface';
import { IPrismaApiService, prismaApiServiceToken } from '../../prisma';
import { DaoError } from '../errors/dao.error';
import { EventPrice } from '@prisma/client';

export class EventPriceDaoImpl implements IEventPriceDao {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService
  ) {}

  async create(
    orgId: string,
    eventId: string,
    createEventPriceDto: CreateEventPriceDto
  ): Promise<EventPrice> {
    try {
      const event = await this.prisma.event.update({
        where: {
          id: eventId,
          organization: {
            id: orgId
          }
        },
        data: {
          prices: {
            push: {
              price: createEventPriceDto.price,
              currency: createEventPriceDto.currency,
              maxLimit: createEventPriceDto.maxLimit
            }
          }
        }
      });

      return event.prices.pop();
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async findAll(eventId: string): Promise<EventPrice[]> {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId
        }
      });
      return event.prices;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async findOne(eventId: string, priceId: string): Promise<EventPrice> {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId
        }
      });

      return event.prices.find((p) => p.id === priceId);
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async update(
    orgId: string,
    eventId: string,
    priceId: string,
    updateEventPriceDto: UpdateEventPriceDto & { sold?: number }
  ): Promise<EventPrice> {
    try {
      const event = await this.prisma.event.update({
        where: {
          id: eventId,
          organization: {
            id: orgId
          }
        },
        data: {
          prices: {
            updateMany: {
              where: {
                id: priceId
              },
              data: {
                price: updateEventPriceDto.price,
                currency: updateEventPriceDto.currency,
                maxLimit: updateEventPriceDto.maxLimit,

                sold: updateEventPriceDto.sold
              }
            }
          }
        }
      });

      return event.prices.find((p) => p.id === priceId);
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async remove(
    orgId: string,
    eventId: string,
    priceId: string
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
          prices: {
            deleteMany: {
              where: {
                id: priceId
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
