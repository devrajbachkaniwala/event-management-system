import { UserDto, UserDtoFactory } from 'src/app/dto';
import { TReviewWithUser } from 'src/app/modules/dao/event-review-dao/event-review-dao.interface';

export class EventReviewDto {
  id: string;
  description: string;
  star: number;
  createdAt: Date;
  modifiedAt: Date;
  userId: string;
  eventId: string;

  user?: UserDto;
}

export class EventReviewDtoFactory {
  static create(review: TReviewWithUser): EventReviewDto {
    const eventReviewDto: EventReviewDto = new EventReviewDto();

    eventReviewDto.id = review.id;
    eventReviewDto.description = review.description;
    eventReviewDto.star = review.star;
    eventReviewDto.createdAt = review.createdAt;
    eventReviewDto.modifiedAt = review.modifiedAt;
    eventReviewDto.userId = review.userId;
    eventReviewDto.eventId = review.eventId;

    if (review.user) {
      eventReviewDto.user = UserDtoFactory.create(review.user);
    }

    return eventReviewDto;
  }
}
