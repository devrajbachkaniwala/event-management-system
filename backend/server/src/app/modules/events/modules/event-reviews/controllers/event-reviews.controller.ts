import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject
} from '@nestjs/common';
import { IEventReviewsService, eventReviewsServiceToken } from '../services';
import { CreateEventReviewDto, EventReviewDto } from '../dto';
import { GetUserId } from 'src/app/decorators';
import { ResErrorDtoFactory, ResSuccessDtoFactory } from 'src/app/dto';

@Controller({ path: 'reviews', version: '1' })
export class EventReviewsController {
  constructor(
    @Inject(eventReviewsServiceToken)
    private readonly eventReviewsService: IEventReviewsService
  ) {}

  @Post()
  async create(
    @GetUserId() userId: string,
    @Param('event_id') eventId: string,
    @Body() createEventReviewDto: CreateEventReviewDto
  ) {
    let eventReview: EventReviewDto = null;
    try {
      eventReview = await this.eventReviewsService.create(
        userId,
        eventId,
        createEventReviewDto
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to create an event review');
    }

    return ResSuccessDtoFactory.create(eventReview);
  }

  @Get()
  async findAll(@Param('event_id') eventId: string) {
    let reviews: EventReviewDto[] = null;
    try {
      reviews = await this.eventReviewsService.findAll(eventId);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get all event reviews');
    }

    return ResSuccessDtoFactory.create(reviews);
  }

  @Get(':review_id')
  async findOne(
    @Param('event_id') eventId: string,
    @Param('review_id') reviewId: string
  ) {
    let eventReview: EventReviewDto = null;
    try {
      eventReview = await this.eventReviewsService.findOne(eventId, reviewId);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get an event review');
    }

    return ResSuccessDtoFactory.create(eventReview);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateEventReviewDto: UpdateEventReviewDto
  // ) {
  //   return this.eventReviewsService.update(+id, updateEventReviewDto);
  // }

  @Delete(':review_id')
  async remove(
    @GetUserId() userId: string,
    @Param('event_id') eventId: string,
    @Param('review_id') reviewId: string
  ) {
    let isDeleted: boolean = false;
    try {
      isDeleted = await this.eventReviewsService.remove(
        userId,
        eventId,
        reviewId
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to delete an event review');
    }

    return ResSuccessDtoFactory.create({
      message: 'Successfully deleted an event review'
    });
  }
}
