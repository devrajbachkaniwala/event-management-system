import { CreateEventDto } from '@/dto/create-event.dto';
import { DateService } from '@/services/date-service';
import {
  FieldErrors,
  UseFieldArrayRemove,
  UseFormRegister
} from 'react-hook-form';

type TTimingFormProps = {
  index: number;
  errors: FieldErrors<CreateEventDto>;
  register: UseFormRegister<CreateEventDto>;
  remove: UseFieldArrayRemove;
  isEditForm: boolean;
  isFieldDisabled: boolean;
};

function TimingForm({
  index,
  errors,
  register,
  remove,
  isEditForm,
  isFieldDisabled
}: TTimingFormProps) {
  return (
    <div className='my-4'>
      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between mb-2'>
          <h2>Timing Plan 1</h2>
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
          <label htmlFor='date' className='label'>
            <span className='label-text'>Date</span>
          </label>
          <input
            id='date'
            type='date'
            min={DateService.getDateString(
              new Date(Date.now() + 1000 * 60 * 60 * 24),
              'yyyy-MM-dd'
            )}
            placeholder='Date'
            className='input input-bordered input-md w-full max-w-xs flex-grow'
            {...register(`timings.${index}.date`)}
            disabled={isFieldDisabled}
          />
        </div>
        <label className='label'>
          {errors.timings &&
          errors.timings[index] &&
          errors.timings[index]?.date ? (
            <>
              <span className='label-text-alt error-msg'></span>
              <span className='label-text-alt error-msg'>
                {errors.timings[index]?.date?.message}
              </span>
            </>
          ) : null}
        </label>
      </div>

      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between'>
          <label htmlFor='startTime' className='label'>
            <span className='label-text'>Start Time</span>
          </label>
          <input
            id='startTime'
            type='time'
            placeholder='Start Time'
            className='input input-bordered input-md w-full max-w-xs flex-grow'
            {...register(`timings.${index}.startTime`)}
            disabled={isFieldDisabled}
          />
        </div>
        <label className='label'>
          {errors.timings &&
          errors.timings[index] &&
          errors.timings[index]?.startTime ? (
            <>
              <span className='label-text-alt error-msg'></span>
              <span className='label-text-alt error-msg'>
                {errors.timings[index]?.startTime?.message}
              </span>
            </>
          ) : null}
        </label>
      </div>

      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between'>
          <label htmlFor='endTime' className='label'>
            <span className='label-text'>End Time</span>
          </label>
          <input
            id='endTime'
            type='time'
            placeholder='End Time'
            className='input input-bordered input-md w-full max-w-xs flex-grow'
            {...register(`timings.${index}.endTime`)}
            disabled={isFieldDisabled}
          />
        </div>
        <label className='label'>
          {errors.timings &&
          errors.timings[index] &&
          errors.timings[index]?.endTime ? (
            <>
              <span className='label-text-alt error-msg'></span>
              <span className='label-text-alt error-msg'>
                {errors.timings[index]?.endTime?.message}
              </span>
            </>
          ) : null}
        </label>
      </div>
    </div>
  );
}

export { TimingForm };
