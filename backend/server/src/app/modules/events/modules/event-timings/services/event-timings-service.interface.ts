import { CreateEventTimingDto, UpdateEventTimingDto } from '../dto';

export const eventTimingsServiceToken = Symbol('eventTimingsServiceToken');
export interface IEventTimingsService {
  create(createEventTimingDto: CreateEventTimingDto): unknown;
  findAll(): unknown;
  findOne(arg0: number): unknown;
  update(arg0: number, updateEventTimingDto: UpdateEventTimingDto): unknown;
  remove(arg0: number): unknown;
}
