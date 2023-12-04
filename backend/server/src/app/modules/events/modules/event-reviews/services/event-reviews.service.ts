import { Inject, Injectable } from '@nestjs/common';
import {
  CreateEventReviewDto,
  EventReviewDto,
  EventReviewDtoFactory
} from '../dto';
import { IEventReviewsService } from './event-reviews-service.interface';
import { EventReviewErrorFactory, EventReviewNotFound } from '../errors';
import {
  IDaoFactory,
  daoFactoryToken
} from 'src/app/modules/dao/dao-factory/dao-factory.interface';
import { IEventReviewDao } from 'src/app/modules/dao/event-review-dao/event-review-dao.interface';

@Injectable()
export class EventReviewsService implements IEventReviewsService {
  private eventReviewDao: IEventReviewDao;

  constructor(@Inject(daoFactoryToken) daoFactory: IDaoFactory) {
    this.eventReviewDao = daoFactory.getEventReviewDao();
  }

  async create(
    userId: string,
    eventId: string,
    createEventReviewDto: CreateEventReviewDto
  ): Promise<EventReviewDto> {
    try {
      const review = await this.eventReviewDao.create(
        userId,
        eventId,
        createEventReviewDto
      );

      return EventReviewDtoFactory.create(review);
    } catch (err: any) {
      throw EventReviewErrorFactory.create(
        err,
        'Failed to create an event review'
      );
    }
  }

  async findAll(eventId: string): Promise<EventReviewDto[]> {
    try {
      const reviews = await this.eventReviewDao.findAll(eventId);

      return reviews.map(EventReviewDtoFactory.create);
    } catch (err: any) {
      throw EventReviewErrorFactory.create(
        err,
        'Failed to get all event reviews'
      );
    }
  }

  async findOne(eventId: string, reviewId: string): Promise<EventReviewDto> {
    try {
      const review = await this.eventReviewDao.findOne(eventId, reviewId);

      if (!review) {
        throw new EventReviewNotFound();
      }

      return EventReviewDtoFactory.create(review);
    } catch (err: any) {
      throw EventReviewErrorFactory.create(
        err,
        'Failed to get an event review'
      );
    }
  }

  // update(id: number, updateEventReviewDto: UpdateEventReviewDto) {
  //   return `This action updates a #${id} eventReview`;
  // }

  async remove(
    userId: string,
    eventId: string,
    reviewId: string
  ): Promise<true> {
    try {
      const review = await this.eventReviewDao.remove(
        userId,
        eventId,
        reviewId
      );

      return true;
    } catch (err: any) {
      throw EventReviewErrorFactory.create(
        err,
        'Failed to delete an event review'
      );
    }
  }
}
