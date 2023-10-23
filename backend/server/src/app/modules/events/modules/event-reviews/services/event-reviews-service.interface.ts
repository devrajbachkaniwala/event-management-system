import { CreateEventReviewDto, UpdateEventReviewDto } from '../dto';

export const eventReviewsServiceToken = Symbol('eventReviewsServiceToken');
export interface IEventReviewsService {
  create(createEventReviewDto: CreateEventReviewDto): unknown;
  findAll(): unknown;
  findOne(arg0: number): unknown;
  update(arg0: number, updateEventReviewDto: UpdateEventReviewDto): unknown;
  remove(arg0: number): unknown;
}
