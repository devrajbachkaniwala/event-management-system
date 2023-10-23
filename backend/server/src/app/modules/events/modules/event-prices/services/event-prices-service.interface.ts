import { CreateEventPriceDto, UpdateEventPriceDto } from '../dto';

export const eventPricesServiceToken = Symbol('eventPricesServiceToken');
export interface IEventPricesService {
  create(createEventPriceDto: CreateEventPriceDto): unknown;
  findAll(): unknown;
  findOne(arg0: number): unknown;
  update(arg0: number, updateEventPriceDto: UpdateEventPriceDto): unknown;
  remove(arg0: number): unknown;
}
