import { PartialType } from '@nestjs/mapped-types';
import { CreateEventTimingDto } from './create-event-timing.dto';

export class UpdateEventTimingDto extends PartialType(CreateEventTimingDto) {}
