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
import { IEventReviewsService, eventReviewsServiceToken } from '../services';
import { CreateEventReviewDto, UpdateEventReviewDto } from '../dto';

@Controller({ path: 'reviews', version: '1' })
export class EventReviewsController {
  constructor(
    @Inject(eventReviewsServiceToken)
    private readonly eventReviewsService: IEventReviewsService
  ) {}

  @Post()
  create(@Body() createEventReviewDto: CreateEventReviewDto) {
    return this.eventReviewsService.create(createEventReviewDto);
  }

  @Get()
  findAll() {
    return this.eventReviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventReviewsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventReviewDto: UpdateEventReviewDto
  ) {
    return this.eventReviewsService.update(+id, updateEventReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventReviewsService.remove(+id);
  }
}
