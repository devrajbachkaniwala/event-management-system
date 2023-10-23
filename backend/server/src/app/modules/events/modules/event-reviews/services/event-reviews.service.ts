import { Injectable } from '@nestjs/common';
import { CreateEventReviewDto, UpdateEventReviewDto } from '../dto';
import { IEventReviewsService } from './event-reviews-service.interface';

@Injectable()
export class EventReviewsService implements IEventReviewsService {
  create(createEventReviewDto: CreateEventReviewDto) {
    return 'This action adds a new eventReview';
  }

  findAll() {
    return `This action returns all eventReviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventReview`;
  }

  update(id: number, updateEventReviewDto: UpdateEventReviewDto) {
    return `This action updates a #${id} eventReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventReview`;
  }
}
