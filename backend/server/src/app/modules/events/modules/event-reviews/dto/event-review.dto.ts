import { Review } from '@prisma/client';

export class EventReviewDto {
  id: string;
  description: string;
  star: number;
  createdAt: Date;
  modifiedAt: Date;
  userId: string;
  eventId: string;
}

export class EventReviewDtoFactory {
  static create(review: Review): EventReviewDto {
    const eventReviewDto: EventReviewDto = new EventReviewDto();

    eventReviewDto.id = review.id;
    eventReviewDto.description = review.description;
    eventReviewDto.star = review.star;
    eventReviewDto.createdAt = review.createdAt;
    eventReviewDto.modifiedAt = review.modifiedAt;
    eventReviewDto.userId = review.userId;
    eventReviewDto.eventId = review.eventId;

    return eventReviewDto;
  }
}
