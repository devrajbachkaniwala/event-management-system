import { ReviewService } from '@/services/review-service';

export const getAllEventReviews = async (eventId: string) => {
  try {
    const reviews = await ReviewService.getAll(eventId);

    return reviews;
  } catch (err: any) {
    console.log(err);
  }
};
