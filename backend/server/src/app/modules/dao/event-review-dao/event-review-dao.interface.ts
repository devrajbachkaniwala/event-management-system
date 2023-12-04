import { Review } from '@prisma/client';
import { CreateEventReviewDto } from '../../events';

export const eventReviewDaoToken = Symbol('eventReviewDaoToken');
export interface IEventReviewDao {
  create(
    userId: string,
    eventId: string,
    createEventReviewDto: CreateEventReviewDto
  ): Promise<Review>;

  findAll(eventId: string): Promise<Review[]>;

  findOne(eventId: string, reviewId: string): Promise<Review>;

  // update(arg0: number, updateEventReviewDto: UpdateEventReviewDto): unknown;

  remove(userId: string, eventId: string, reviewId: string): Promise<boolean>;
}
