import { ReviewService } from '@/services/review-service';

export const deleteEventReview = async (eventId: string, reviewId: string) => {
  try {
    const res = await ReviewService.delete(eventId, reviewId);

    return res;
  } catch (err: any) {
    console.log(err);
  }
};
