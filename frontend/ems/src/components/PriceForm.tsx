'use client';

import { CreateEventDto } from '@/dto/create-event.dto';
import {
  FieldErrors,
  UseFieldArrayRemove,
  UseFormRegister
} from 'react-hook-form';

type TPriceFormProps = {
  index: number;
  errors: FieldErrors<CreateEventDto>;
  register: UseFormRegister<CreateEventDto>;
  remove: UseFieldArrayRemove;
  isEditForm: boolean;
  isFieldDisabled: boolean;
};

function PriceForm({
  index,
  register,
  errors,
  remove,
  isEditForm,
  isFieldDisabled
}: TPriceFormProps) {
  return (
    <div className='my-4'>
      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between mb-2'>
          <h2>Price Plan {index + 1}</h2>
          {index > 0 ? (
            <button
              type='button'
              className='btn btn-sm btn-outline btn-error'
              onClick={() => remove(index)}
            >
              Delete
            </button>
          ) : null}
        </div>
        <div className='flex justify-between'>
          <label htmlFor='price' className='label'>
            <span className='label-text'>Price</span>
          </label>
          <input
            id='price'
            type='number'
            min={0}
            placeholder='Price'
            className='input input-bordered input-md w-full max-w-xs flex-grow'
            {...register(`prices.${index}.price`)}
            disabled={isFieldDisabled}
          />
        </div>
        <label className='label'>
          {errors.prices &&
          errors.prices[index] &&
          errors.prices[index]?.price ? (
            <>
              <span className='label-text-alt error-msg'></span>
              <span className='label-text-alt error-msg'>
                {errors.prices[index]?.price?.message}
              </span>
            </>
          ) : null}
        </label>
      </div>

      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between'>
          <label htmlFor='currency' className='label'>
            <span className='label-text'>Currency</span>
          </label>
          <input
            id='currency'
            type='text'
            placeholder='Currency'
            minLength={3}
            maxLength={3}
            className='input input-bordered input-md w-full max-w-xs flex-grow'
            {...register(`prices.${index}.currency`)}
            disabled={isFieldDisabled}
          />
        </div>
        <label className='label'>
          {errors.prices &&
          errors.prices[index] &&
          errors.prices[index]?.currency ? (
            <>
              <span className='label-text-alt error-msg'></span>
              <span className='label-text-alt error-msg'>
                {errors.prices[index]?.currency?.message}
              </span>
            </>
          ) : null}
        </label>
      </div>

      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between'>
          <label htmlFor='maxLimit' className='label'>
            <span className='label-text'>Max Limit</span>
          </label>
          <input
            id='maxLimit'
            type='number'
            min={0}
            placeholder='Max Limit'
            className='input input-bordered input-md w-full max-w-xs flex-grow'
            {...register(`prices.${index}.maxLimit`)}
            disabled={isFieldDisabled}
          />
        </div>
        <label className='label'>
          {errors.prices &&
          errors.prices[index] &&
          errors.prices[index]?.maxLimit ? (
            <>
              <span className='label-text-alt error-msg'></span>
              <span className='label-text-alt error-msg'>
                {errors.prices[index]?.maxLimit?.message}
              </span>
            </>
          ) : null}
        </label>
      </div>
    </div>
  );
}

export { PriceForm };
