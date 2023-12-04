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
  IDaoFactory,
  daoFactoryToken
} from 'src/app/modules/dao/dao-factory/dao-factory.interface';
import { IEventPriceDao } from 'src/app/modules/dao/event-price-dao/event-price-dao.interface';

@Injectable()
export class EventPricesService implements IEventPricesService {
  private eventPriceDao: IEventPriceDao;

  constructor(@Inject(daoFactoryToken) daoFactory: IDaoFactory) {
    this.eventPriceDao = daoFactory.getEventPriceDao();
  }

  async create(
    orgId: string,
    eventId: string,
    createEventPriceDto: CreateEventPriceDto
  ): Promise<EventPriceDto> {
    try {
      const eventPrice = await this.eventPriceDao.create(
        orgId,
        eventId,
        createEventPriceDto
      );

      return EventPriceDtoFactory.create(eventPrice);
    } catch (err: any) {
      throw EventPriceErrorFactory.create(
        err,
        'Failed to create an event price'
      );
    }
  }

  async findAll(eventId: string): Promise<EventPriceDto[]> {
    try {
      const prices = await this.eventPriceDao.findAll(eventId);

      return prices.map(EventPriceDtoFactory.create);
    } catch (err: any) {
      throw EventPriceErrorFactory.create(
        err,
        'Failed to get all event prices'
      );
    }
  }

  async findOne(eventId: string, priceId: string): Promise<EventPriceDto> {
    try {
      const price = await this.eventPriceDao.findOne(eventId, priceId);

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
      const price = await this.eventPriceDao.update(
        orgId,
        eventId,
        priceId,
        updateEventPriceDto
      );

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
      const price = await this.eventPriceDao.remove(orgId, eventId, priceId);

      return true;
    } catch (err: any) {
      throw EventPriceErrorFactory.create(
        err,
        'Failed to delete an event price'
      );
    }
  }
}
