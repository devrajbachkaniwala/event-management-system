'use client';

import { useEffect, useMemo, useState } from 'react';
import { ReviewForm } from './ReviewForm';
import { EventReviewDto } from '@/dto/event-review.dto';
import { ReviewList } from './ReviewList';
import { createEventReview } from '@/utils/createEventReview';
import { CreateEventReviewDto } from '@/dto/create-event-review.dto';
import { getAllEventReviews } from '@/utils/getAllEventReviews';
import { Loading } from './Loading';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { deleteEventReview } from '@/utils/deleteEventReview';

type TReviewProps = {
  eventId: string;
};

function Review({ eventId }: TReviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<EventReviewDto[]>([]);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    getAllEventReviews(eventId)
      .then((reviews) => {
        if (reviews) {
          setReviews(reviews);
        }
      })
      .finally(() => setIsLoading(false));
  }, [eventId]);

  const isFieldDisabled = useMemo(() => {
    return reviews.some((r) => r.user?.id === user?.id);
  }, [user, reviews]);

  const handleCreateReview = async (data: CreateEventReviewDto) => {
    const review = await createEventReview(eventId, data);
    if (review) {
      console.log(review);
      setReviews((prev) => [...prev, review]);
    }
    return review;
  };

  const handleDeleteReview = async (reviewId: string) => {
    const res = await deleteEventReview(eventId, reviewId);
    if (res) {
      console.log(res);
      setReviews((prev) => prev.filter((p) => p.id !== reviewId));
    }
    return res;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <ReviewForm
        createReview={handleCreateReview}
        isFieldDisabled={isFieldDisabled}
      />
      <h2>Reviews</h2>

      {reviews && reviews.length ? (
        <ReviewList reviews={reviews} deleteReview={handleDeleteReview} />
      ) : (
        <div>No reviews</div>
      )}
    </div>
  );
}

export { Review };
