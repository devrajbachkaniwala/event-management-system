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
import { CreateEventPriceDto, UpdateEventPriceDto } from '../dto';
import { IEventPricesService, eventPricesServiceToken } from '../services';

@Controller({ path: 'prices', version: '1' })
export class EventPricesController {
  constructor(
    @Inject(eventPricesServiceToken)
    private readonly eventPricesService: IEventPricesService
  ) {}

  @Post()
  create(@Body() createEventPriceDto: CreateEventPriceDto) {
    return this.eventPricesService.create(createEventPriceDto);
  }

  @Get()
  findAll() {
    return this.eventPricesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventPricesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventPriceDto: UpdateEventPriceDto
  ) {
    return this.eventPricesService.update(+id, updateEventPriceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventPricesService.remove(+id);
  }
}
