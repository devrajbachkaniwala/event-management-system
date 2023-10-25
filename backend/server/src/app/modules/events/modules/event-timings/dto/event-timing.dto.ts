import { EventTiming } from '@prisma/client';

export class EventTimingDto {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
}

export class EventTimingDtoFactory {
  static create(eventTiming: EventTiming): EventTimingDto {
    const eventTimingDto: EventTimingDto = new EventTimingDto();

    eventTimingDto.id = eventTiming.id;
    eventTimingDto.date = eventTiming.date;
    eventTimingDto.startTime = eventTiming.startTime;
    eventTimingDto.endTime = eventTiming.endTime;

    return eventTimingDto;
  }
}
