'use client';

import { EventReviewDto } from '@/dto/event-review.dto';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import { useSelector } from 'react-redux';

type TReviewListProps = {
  reviews: EventReviewDto[];
  deleteReview: (reviewId: string) => Promise<
    | {
        message: string;
      }
    | undefined
  >;
};

function ReviewList({ reviews, deleteReview }: TReviewListProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className='my-2'>
      {reviews.map((review) => (
        <div key={review.id}>
          {review.user ? (
            <div className='border p-3 m-4 border-slate-400'>
              <div className='flex items-center gap-2 my-2'>
                <div className='avatar'>
                  <div className='mask mask-squircle bg-slate-500 w-12 h-12'>
                    {review.user.userPhotoUrl ? (
                      <Image
                        src={review.user.userPhotoUrl}
                        alt={'user photo'}
                        width={200}
                        height={200}
                      />
                    ) : null}
                  </div>
                </div>
                <div>{review.user.fullName}</div>
              </div>

              <div className='my-2'>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className='rating'>
                    <input
                      type='radio'
                      name='rating'
                      className={`mask mask-star ${
                        rating <= review.star ? 'bg-yellow-600' : ''
                      }`}
                      disabled
                    />
                  </div>
                ))}
              </div>

              <div className='my-2'>{review.description}</div>

              {user && user.id === review.userId ? (
                <div className='mt-2'>
                  <button
                    type='button'
                    className='btn btn-error btn-outline btn-sm'
                    onClick={() => deleteReview(review.id)}
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export { ReviewList };
