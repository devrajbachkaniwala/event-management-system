import { Inject, Injectable } from '@nestjs/common';
import {
  CreateEventPriceDto,
  EventPriceDto,
  EventPriceDtoFactory,
  UpdateEventPriceDto
} from '../dto';
import { IEventPricesService } from './event-prices-service.interface';
import { EventPriceErrorFactory, EventPriceNotFound } from '../errors';
import {
  IPrismaApiService,
  prismaApiServiceToken
} from 'src/app/modules/prisma';

@Injectable()
export class EventPricesService implements IEventPricesService {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService
  ) {}

  async create(
    orgId: string,
    eventId: string,
    createEventPriceDto: CreateEventPriceDto
  ): Promise<EventPriceDto> {
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

      return EventPriceDtoFactory.create(event.prices.pop());
    } catch (err: any) {
      throw EventPriceErrorFactory.create(
        err,
        'Failed to create an event price'
      );
    }
  }

  async findAll(eventId: string): Promise<EventPriceDto[]> {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId
        }
      });

      return event.prices.map(EventPriceDtoFactory.create);
    } catch (err: any) {
      throw EventPriceErrorFactory.create(
        err,
        'Failed to get all event prices'
      );
    }
  }

  async findOne(eventId: string, priceId: string): Promise<EventPriceDto> {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId
        }
      });

      const price = event.prices.find((p) => p.id === priceId);

      if (!price) {
        throw new EventPriceNotFound();
      }

      return EventPriceDtoFactory.create(price);
    } catch (err: any) {
      throw EventPriceErrorFactory.create(err, 'Failed to get an event price');
    }
  }

  async update(
    orgId: string,
    eventId: string,
    priceId: string,
    updateEventPriceDto: UpdateEventPriceDto
  ): Promise<EventPriceDto> {
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
                maxLimit: updateEventPriceDto.maxLimit
              }
            }
          }
        }
      });

      const price = event.prices.find((p) => p.id === priceId);

      if (!price) {
        throw new EventPriceNotFound();
      }

      return EventPriceDtoFactory.create(price);
    } catch (err: any) {
      throw EventPriceErrorFactory.create(
        err,
        'Failed to update an event price'
      );
    }
  }

  async remove(orgId: string, eventId: string, priceId: string): Promise<true> {
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
      throw EventPriceErrorFactory.create(
        err,
        'Failed to delete an event price'
      );
    }
  }
}
