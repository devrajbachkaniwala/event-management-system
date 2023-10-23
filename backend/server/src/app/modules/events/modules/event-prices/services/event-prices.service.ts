import { Injectable } from '@nestjs/common';
import { CreateEventPriceDto, UpdateEventPriceDto } from '../dto';
import { IEventPricesService } from './event-prices-service.interface';

@Injectable()
export class EventPricesService implements IEventPricesService {
  create(createEventPriceDto: CreateEventPriceDto) {
    return 'This action adds a new eventPrice';
  }

  findAll() {
    return `This action returns all eventPrices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventPrice`;
  }

  update(id: number, updateEventPriceDto: UpdateEventPriceDto) {
    return `This action updates a #${id} eventPrice`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventPrice`;
  }
}
