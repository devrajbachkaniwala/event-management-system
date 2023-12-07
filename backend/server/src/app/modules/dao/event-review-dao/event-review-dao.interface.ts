import { Review, User } from '@prisma/client';
import { CreateEventReviewDto } from '../../events';

export type TReviewWithUser = Review & { user?: User };

export const eventReviewDaoToken = Symbol('eventReviewDaoToken');
export interface IEventReviewDao {
  create(
    userId: string,
    eventId: string,
    createEventReviewDto: CreateEventReviewDto
  ): Promise<TReviewWithUser>;

  findAll(eventId: string): Promise<TReviewWithUser[]>;

  findOne(eventId: string, reviewId: string): Promise<TReviewWithUser>;

  // update(arg0: number, updateEventReviewDto: UpdateEventReviewDto): unknown;

  remove(userId: string, eventId: string, reviewId: string): Promise<boolean>;
}
