import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject
} from '@nestjs/common';
import { IEventTimingsService, eventTimingsServiceToken } from '../services';
import { CreateEventTimingDto, UpdateEventTimingDto } from '../dto';

@Controller({ path: 'timings', version: '1' })
export class EventTimingsController {
  constructor(
    @Inject(eventTimingsServiceToken)
    private readonly eventTimingsService: IEventTimingsService
  ) {}

  @Post()
  create(@Body() createEventTimingDto: CreateEventTimingDto) {
    return this.eventTimingsService.create(createEventTimingDto);
  }

  @Get()
  findAll() {
    return this.eventTimingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventTimingsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventTimingDto: UpdateEventTimingDto
  ) {
    return this.eventTimingsService.update(+id, updateEventTimingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventTimingsService.remove(+id);
  }
}
