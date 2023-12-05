'use client';

import 'reflect-metadata';

import { CreateEventReviewDto } from '@/dto/create-event-review.dto';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { FormEvent, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { createEventReview } from '@/utils/createEventReview';
import { EventReviewDto } from '@/dto/event-review.dto';

const reviewDefaultValue: CreateEventReviewDto = {
  description: '',
  star: 0
};

type TReviewFormProps = {
  createReview: (
    data: CreateEventReviewDto
  ) => Promise<EventReviewDto | undefined>;
  isFieldDisabled: boolean;
};

function ReviewForm({ createReview, isFieldDisabled }: TReviewFormProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  const router = useRouter();

  const resolver = classValidatorResolver(CreateEventReviewDto);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateEventReviewDto>({
    resolver,
    defaultValues: reviewDefaultValue
  });

  const onSubmit: SubmitHandler<CreateEventReviewDto> = async (data) => {
    if (!user) {
      router.push('/login');
      return;
    }
    const review = await createReview(data);
    if (review) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='form-control max-w-sm'>
        <div className='flex justify-between my-2'>
          <label htmlFor='star' className='label w-2/5 items-start'>
            <span className='label-text'>Star</span>
          </label>
          <div className='rating w-3/4'>
            <input
              id='star'
              type='radio'
              className='mask mask-star hidden'
              defaultChecked
              value={0}
              {...register('star')}
              disabled={isFieldDisabled}
            />
            {[1, 2, 3, 4, 5].map((rating) => (
              <input
                key={rating}
                type='radio'
                value={rating}
                className='mask mask-star'
                {...register('star')}
                disabled={isFieldDisabled}
              />
            ))}
            {/* <input type='radio' name='rating-1' className='mask mask-star' />
            <input type='radio' name='rating-1' className='mask mask-star' />
            <input type='radio' name='rating-1' className='mask mask-star' />
            <input type='radio' name='rating-1' className='mask mask-star' /> */}
          </div>
        </div>
        <label className='label'>
          {errors.star ? (
            <>
              <span className='label-text-alt error-msg'></span>
              <span className='label-text-alt error-msg'>
                {errors.star.message}
              </span>
            </>
          ) : null}
        </label>
      </div>

      <div className='form-control max-w-sm'>
        <div className='flex justify-between my-2'>
          <label htmlFor='description' className='label w-2/5 items-start'>
            <span className='label-text'>Description</span>
          </label>
          <textarea
            id='description'
            className='textarea textarea-info w-3/4 h-24'
            placeholder='Description'
            {...register('description')}
            disabled={isFieldDisabled}
          ></textarea>
        </div>
        <label className='label'>
          {errors.description ? (
            <>
              <span className='label-text-alt error-msg'></span>
              <span className='label-text-alt error-msg'>
                {errors.description.message}
              </span>
            </>
          ) : null}
        </label>
      </div>

      <div className='max-w-sm'>
        <div className='flex justify-between my-2'>
          <div className='w-2/5'></div>
          <div className='w-3/4'>
            <button
              type='submit'
              className='btn btn-info btn-outline'
              disabled={isFieldDisabled}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export { ReviewForm };
