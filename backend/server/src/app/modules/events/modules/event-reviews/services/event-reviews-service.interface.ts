import { CreateEventReviewDto, EventReviewDto } from '../dto';

export const eventReviewsServiceToken = Symbol('eventReviewsServiceToken');
export interface IEventReviewsService {
  create(
    userId: string,
    eventId: string,
    createEventReviewDto: CreateEventReviewDto
  ): Promise<EventReviewDto>;
  findAll(eventId: string): Promise<EventReviewDto[]>;
  findOne(eventId: string, reviewId: string): Promise<EventReviewDto>;
  // update(arg0: number, updateEventReviewDto: UpdateEventReviewDto): unknown;
  remove(userId: string, eventId: string, reviewId: string): Promise<true>;
}
