import { Injectable } from '@nestjs/common';
import { IEventTimingsService } from './event-timings-service.interface';
import { CreateEventTimingDto, UpdateEventTimingDto } from '../dto';

@Injectable()
export class EventTimingsService implements IEventTimingsService {
  create(createEventTimingDto: CreateEventTimingDto) {
    return 'This action adds a new eventTiming';
  }

  findAll() {
    return `This action returns all eventTimings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventTiming`;
  }

  update(id: number, updateEventTimingDto: UpdateEventTimingDto) {
    return `This action updates a #${id} eventTiming`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventTiming`;
  }
}
