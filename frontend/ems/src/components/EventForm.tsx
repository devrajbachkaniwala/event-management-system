'use client';

import 'reflect-metadata';

import { CreateEventDto } from '@/dto/create-event.dto';
import { EventPhotoForm } from './EventPhotoForm';
import { PriceForm } from './PriceForm';
import { TimingForm } from './TimingForm';
import { CreateEventPriceDto } from '@/dto/create-event-price.dto';
import { CreateEventTimingDto } from '@/dto/create-event-timing.dto';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { DateService } from '@/services/date-service';
import { useState } from 'react';
import { v4 } from 'uuid';
import { getEvent } from '@/utils/getEvent';
import { useRouter } from 'next/navigation';
import { createEvent } from '@/utils/createEvent';
import { Toast } from './Toast';
import { wait } from '@/utils/wait';
import { UpdateEventDto } from '@/dto/update-event.dto';
import { updateEvent } from '@/utils/updateEvent';
import { deleteEventPhoto } from '@/utils/deleteEventPhoto';

const priceDefaultValue: CreateEventPriceDto = {
  price: 0,
  currency: '',
  maxLimit: 0
};

const timingDefaultValue: CreateEventTimingDto = {
  date: DateService.getDateString(
    new Date(Date.now() + 1000 * 60 * 60 * 24),
    'yyyy-MM-dd'
  ),
  startTime: '',
  endTime: ''
};

const eventDefaultValue: CreateEventDto = {
  name: '',
  description: '',
  city: '',
  state: '',
  country: '',
  venue: '',
  category: '',
  timings: [timingDefaultValue],
  prices: [priceDefaultValue]
};

const eventPhotoDefaultValue: TCreateEventPhoto = {
  id: v4(),
  file: undefined,
  touched: true
};

type TEventFormProps = {
  eventId?: string;
  isEditForm: boolean;
};

function EventForm({ eventId, isEditForm }: TEventFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFieldDisabled, setIsFieldDisabled] = useState(isEditForm);

  const [photoFiles, setPhotoFiles] = useState<Array<TCreateEventPhoto>>([
    eventPhotoDefaultValue
  ]);
  const [photoErrorMsg, setPhotoErrMsg] = useState('');
  const [toastData, setToastData] = useState<TToast>();

  const router = useRouter();

  const handleAppendPhoto = () => {
    setPhotoFiles((prev) => {
      return [...prev, { id: v4(), file: undefined, touched: true }];
    });
  };

  const resolver = classValidatorResolver(CreateEventDto);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateEventDto>({
    resolver,
    defaultValues: async () => {
      if (isEditForm && eventId) {
        const event = await getEvent(eventId);
        setIsLoading(false);
        if (event) {
          setPhotoFiles(
            event.photos.map((p) => ({
              ...p,
              touched: false
            }))
          );
          return event;
        }
      }
      setIsLoading(false);
      return eventDefaultValue;
    }
  });

  const {
    fields: pricesField,
    append: appendPrice,
    remove: removePrice
  } = useFieldArray({
    name: 'prices',
    control
  });

  const {
    fields: timingsField,
    append: appendTiming,
    remove: removeTiming
  } = useFieldArray({
    name: 'timings',
    control
  });

  const handleCreate = async (
    data: CreateEventDto,
    photoFiles: (File | undefined)[]
  ) => {
    const event = await createEvent(data, photoFiles);

    if (event) {
      setToastData({
        success: true,
        message: 'Successfully created an event'
      });
    } else {
      setToastData({
        success: false,
        message: 'Failed to create an event'
      });
    }

    await wait(1);
    setToastData(undefined);

    if (!isEditForm && event) {
      router.push(`/events/${event?.id}`);
    }
  };

  const handleEdit = async (
    data: UpdateEventDto,
    photoFiles: (File | undefined)[]
  ) => {
    if (!eventId) {
      return;
    }

    const event = await updateEvent(eventId, data, photoFiles);

    setPhotoFiles((file) => file.map((f) => ({ ...f, touched: false })));

    if (event) {
      setToastData({
        success: true,
        message: 'Successfully updated an event'
      });
    } else {
      setToastData({
        success: false,
        message: 'Failed to update an event'
      });
    }

    if (isEditForm) {
      setIsFieldDisabled(true);
    }

    await wait(1);
    setToastData(undefined);
  };

  const onSubmit: SubmitHandler<CreateEventDto> = async (data) => {
    if (!photoFiles.every((f) => !!f.file || !!f.photoUrl)) {
      setPhotoErrMsg((prev) => 'Photo file is required');
      return;
    }

    console.log(data);
    console.log(photoFiles);

    if (isEditForm) {
      const f = photoFiles.map((p) => {
        if (p.touched) {
          return p.file;
        }
      });
      await handleEdit(data, f);
    } else {
      const files = photoFiles.map((p) => p.file);
      await handleCreate(data, files);
    }
  };

  if (isLoading) {
    return <div className='text-center'>Loading...</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-control w-full max-w-lg'>
          <div className='flex justify-between'>
            <label htmlFor='name' className='label'>
              <span className='label-text'>Event name</span>
            </label>
            <input
              id='name'
              type='text'
              placeholder='Event name'
              className='input input-bordered input-md w-full max-w-xs flex-grow'
              {...register('name')}
              disabled={isFieldDisabled}
            />
          </div>
          <label className='label'>
            {errors.name ? (
              <>
                <span className='label-text-alt error-msg'></span>
                <span className='label-text-alt error-msg'>
                  {errors.name.message}
                </span>
              </>
            ) : null}
          </label>
        </div>

        <div className='form-control w-full max-w-lg'>
          <div className='flex justify-between'>
            <label htmlFor='description' className='label'>
              <span className='label-text'>Event description</span>
            </label>
            <textarea
              id='description'
              className='textarea textarea-bordered textarea-md h-24 max-w-xs flex-grow'
              placeholder='Event description'
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

        <div className='form-control w-full max-w-lg'>
          <div className='flex justify-between'>
            <label htmlFor='city' className='label'>
              <span className='label-text'>City</span>
            </label>
            <input
              id='city'
              type='text'
              placeholder='City'
              className='input input-bordered input-md w-full max-w-xs flex-grow'
              {...register('city')}
              disabled={isFieldDisabled}
            />
          </div>
          <label className='label'>
            {errors.city ? (
              <>
                <span className='label-text-alt error-msg'></span>
                <span className='label-text-alt error-msg'>
                  {errors.city.message}
                </span>
              </>
            ) : null}
          </label>
        </div>

        <div className='form-control w-full max-w-lg'>
          <div className='flex justify-between'>
            <label htmlFor='state' className='label'>
              <span className='label-text'>State</span>
            </label>
            <input
              id='state'
              type='text'
              placeholder='State'
              className='input input-bordered input-md w-full max-w-xs flex-grow'
              {...register('state')}
              disabled={isFieldDisabled}
            />
          </div>
          <label className='label'>
            {errors.state ? (
              <>
                <span className='label-text-alt error-msg'></span>
                <span className='label-text-alt error-msg'>
                  {errors.state.message}
                </span>
              </>
            ) : null}
          </label>
        </div>

        <div className='form-control w-full max-w-lg'>
          <div className='flex justify-between'>
            <label htmlFor='country' className='label'>
              <span className='label-text'>Country</span>
            </label>
            <input
              id='country'
              type='text'
              placeholder='Country'
              className='input input-bordered input-md w-full max-w-xs flex-grow'
              {...register('country')}
              disabled={isFieldDisabled}
            />
          </div>
          <label className='label'>
            {errors.country ? (
              <>
                <span className='label-text-alt error-msg'></span>
                <span className='label-text-alt error-msg'>
                  {errors.country.message}
                </span>
              </>
            ) : null}
          </label>
        </div>

        <div className='form-control w-full max-w-lg'>
          <div className='flex justify-between'>
            <label htmlFor='venue' className='label'>
              <span className='label-text'>Venue</span>
            </label>
            <input
              id='venue'
              type='text'
              placeholder='Venue'
              className='input input-bordered input-md w-full max-w-xs flex-grow'
              {...register('venue')}
              disabled={isFieldDisabled}
            />
          </div>
          <label className='label'>
            {errors.venue ? (
              <>
                <span className='label-text-alt error-msg'></span>
                <span className='label-text-alt error-msg'>
                  {errors.venue.message}
                </span>
              </>
            ) : null}
          </label>
        </div>

        <div className='form-control w-full max-w-lg'>
          <div className='flex justify-between'>
            <label htmlFor='category' className='label'>
              <span className='label-text'>Category</span>
            </label>
            <input
              id='category'
              type='text'
              placeholder='Category'
              className='input input-bordered input-md w-full max-w-xs flex-grow'
              {...register('category')}
              disabled={isFieldDisabled}
            />
          </div>
          <label className='label'>
            {errors.category ? (
              <>
                <span className='label-text-alt error-msg'></span>
                <span className='label-text-alt error-msg'>
                  {errors.category.message}
                </span>
              </>
            ) : null}
          </label>
        </div>

        {pricesField.map((priceField, idx) => {
          return (
            <PriceForm
              key={priceField.id}
              index={idx}
              errors={errors}
              register={register}
              remove={removePrice}
              isEditForm={isEditForm}
              isFieldDisabled={isFieldDisabled}
            />
          );
        })}

        <div className='max-w-lg flex justify-center'>
          <button
            type='button'
            className='btn btn-sm btn-outline btn-info'
            onClick={() => appendPrice(priceDefaultValue)}
            disabled={isFieldDisabled}
          >
            Add another price
          </button>
        </div>

        {timingsField.map((timingField, idx) => {
          return (
            <TimingForm
              key={timingField.id}
              index={idx}
              errors={errors}
              register={register}
              remove={removeTiming}
              isEditForm={isEditForm}
              isFieldDisabled={isFieldDisabled}
            />
          );
        })}

        <div className='max-w-lg flex justify-center'>
          <button
            type='button'
            className='btn btn-sm btn-outline btn-info'
            onClick={() => appendTiming(timingDefaultValue)}
            disabled={isFieldDisabled}
          >
            Add another Timing
          </button>
        </div>

        {photoFiles.map((photoFile, idx) => (
          <EventPhotoForm
            key={photoFile.id}
            index={idx}
            setPhotoFile={(file: File | undefined) =>
              setPhotoFiles((prev) =>
                prev.map((p) => {
                  if (p.id === photoFile.id) {
                    if (eventId) {
                      deleteEventPhoto(eventId, photoFile.id).then(console.log);
                    }
                    return { ...p, file, touched: true };
                  }
                  return p;
                })
              )
            }
            remove={async () => {
              if (eventId) {
                const res = await deleteEventPhoto(eventId, photoFile.id);
                console.log(res);
              }
              setPhotoFiles((prev) =>
                prev.filter((p) => p.id !== photoFile.id)
              );
            }}
            errorMsg={photoErrorMsg}
            photoUrl={photoFile.photoUrl}
            isEditForm={isEditForm}
            isFieldDisabled={isFieldDisabled}
          />
        ))}

        <div className='max-w-lg flex justify-center'>
          <button
            type='button'
            className='btn btn-sm btn-outline btn-info'
            onClick={handleAppendPhoto}
            disabled={isFieldDisabled}
          >
            Add another photo
          </button>
        </div>

        <div className='max-w-lg my-4'>
          {isEditForm ? (
            <button
              type='submit'
              className={`btn btn-block btn-outline ${
                isFieldDisabled ? 'btn-info' : 'btn-success'
              }`}
              onClick={(e) => {
                if (isFieldDisabled) {
                  e.preventDefault();
                  setIsFieldDisabled(false);
                }
              }}
            >
              {isFieldDisabled ? 'Edit' : 'Save'}
            </button>
          ) : (
            <button
              type='submit'
              className='btn btn-block btn-outline btn-success'
            >
              Create
            </button>
          )}
        </div>
      </form>

      <Toast toastData={toastData} />
    </>
  );
}

export { EventForm };
