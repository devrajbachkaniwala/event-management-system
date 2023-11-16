'use client';

import { EventPhotoForm } from './EventPhotoForm';
import { PriceForm } from './PriceForm';
import { TimingForm } from './TimingForm';

function EventForm() {
  return (
    <form>
      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between'>
          <label className='label'>
            <span className='label-text'>Event name</span>
          </label>
          <input
            type='text'
            placeholder='Event name'
            className='input input-bordered input-md w-full max-w-xs flex-grow'
          />
        </div>
        <label className='label'>
          <span className='label-text-alt error-msg'></span>
          <span className='label-text-alt error-msg'>Bottom Left label</span>
        </label>
      </div>

      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between'>
          <label className='label'>
            <span className='label-text'>Event description</span>
          </label>
          <textarea
            className='textarea textarea-bordered textarea-md h-24 max-w-xs flex-grow'
            placeholder='Event description'
          ></textarea>
        </div>
        <label className='label'>
          <span className='label-text-alt error-msg'></span>
          <span className='label-text-alt error-msg'>Bottom Left label</span>
        </label>
      </div>

      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between'>
          <label className='label'>
            <span className='label-text'>City</span>
          </label>
          <input
            type='text'
            placeholder='City'
            className='input input-bordered input-md w-full max-w-xs flex-grow'
          />
        </div>
        <label className='label'>
          <span className='label-text-alt error-msg'></span>
          <span className='label-text-alt error-msg'>Bottom Left label</span>
        </label>
      </div>

      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between'>
          <label className='label'>
            <span className='label-text'>State</span>
          </label>
          <input
            type='text'
            placeholder='State'
            className='input input-bordered input-md w-full max-w-xs flex-grow'
          />
        </div>
        <label className='label'>
          <span className='label-text-alt error-msg'></span>
          <span className='label-text-alt error-msg'>Bottom Left label</span>
        </label>
      </div>

      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between'>
          <label className='label'>
            <span className='label-text'>Country</span>
          </label>
          <input
            type='text'
            placeholder='Country'
            className='input input-bordered input-md w-full max-w-xs flex-grow'
          />
        </div>
        <label className='label'>
          <span className='label-text-alt error-msg'></span>
          <span className='label-text-alt error-msg'>Bottom Left label</span>
        </label>
      </div>

      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between'>
          <label className='label'>
            <span className='label-text'>Venue</span>
          </label>
          <input
            type='text'
            placeholder='Venue'
            className='input input-bordered input-md w-full max-w-xs flex-grow'
          />
        </div>
        <label className='label'>
          <span className='label-text-alt error-msg'></span>
          <span className='label-text-alt error-msg'>Bottom Left label</span>
        </label>
      </div>

      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between'>
          <label className='label'>
            <span className='label-text'>Category</span>
          </label>
          <input
            type='text'
            placeholder='Category'
            className='input input-bordered input-md w-full max-w-xs flex-grow'
          />
        </div>
        <label className='label'>
          <span className='label-text-alt error-msg'></span>
          <span className='label-text-alt error-msg'>Bottom Left label</span>
        </label>
      </div>

      <PriceForm />
      <div className='max-w-lg flex justify-center'>
        <button type='button' className='btn btn-sm btn-outline btn-info'>
          Add another price
        </button>
      </div>

      <TimingForm />
      <div className='max-w-lg flex justify-center'>
        <button type='button' className='btn btn-sm btn-outline btn-info'>
          Add another Timing
        </button>
      </div>

      <EventPhotoForm />
      <div className='max-w-lg flex justify-center'>
        <button type='button' className='btn btn-sm btn-outline btn-info'>
          Add another photo
        </button>
      </div>

      <div className='max-w-lg my-4'>
        <button type='button' className='btn btn-block btn-outline btn-success'>
          Submit
        </button>
      </div>
    </form>
  );
}

export { EventForm };
