import { CreateEventReviewDto } from '@/dto/create-event-review.dto';
import { ReviewService } from '@/services/review-service';

export const createEventReview = async (
  eventId: string,
  createEventReviewDto: CreateEventReviewDto
) => {
  try {
    const review = await ReviewService.create(eventId, createEventReviewDto);

    return review;
  } catch (err: any) {
    console.log(err);
  }
};
