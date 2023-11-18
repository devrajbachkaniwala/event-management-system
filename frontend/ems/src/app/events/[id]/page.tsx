'use client';

import { Toast } from '@/components/Toast';
import { CreateBookingDto } from '@/dto/create-booking.dto';
import { EventDto } from '@/dto/event.dto';
import { DateService } from '@/services/date-service';
import { bookEvent } from '@/utils/bookEvent';
import { getAllEvents } from '@/utils/getAllEvents';
import { getEvent } from '@/utils/getEvent';
import { getProfile } from '@/utils/getProfile';
import { wait } from '@/utils/wait';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

type TEventProps = {
  params: {
    id: string;
  };
};

function Event({ params }: TEventProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<EventDto>();

  const [selectedPriceId, setSelectedPriceId] = useState<string>();
  const [selectedTimingId, setSelectedTimingId] = useState<string>();
  const [selectedQty, setSelectedQty] = useState<number>(1);

  const [toastData, setToastData] = useState<TToast>();

  const router = useRouter();

  useEffect(() => {
    setToastData(undefined);

    getEvent(params.id)
      .then((e) => setEvent(e))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  useEffect(() => {
    setSelectedPriceId(event?.prices[0].id);
    setSelectedTimingId(event?.timings[0].id);
  }, [event]);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.name === 'price') {
      setSelectedPriceId(e.target.value);
    } else if (e.target.name === 'timing') {
      setSelectedTimingId(e.target.value);
    } else if (e.target.name === 'qty') {
      setSelectedQty(+e.target.value);
    }
  };

  const selectedPrice = useMemo(() => {
    return event?.prices.find((p) => p.id === selectedPriceId);
  }, [selectedPriceId]);

  const selectedTiming = useMemo(() => {
    return event?.timings.find((t) => t.id === selectedTimingId);
  }, [selectedTimingId]);

  const handleConfirm = async () => {
    try {
      const modal = document.getElementById('my_modal_2') as {
        open: boolean;
      } | null;
      if (modal) {
        modal.open = false;
      }
      const user = await getProfile();

      if (!user) {
        router.replace('/login');
        return;
      }

      if (event && selectedPriceId && selectedTimingId) {
        const createBooking: CreateBookingDto = {
          eventId: event.id,
          orgId: event.orgId,
          priceId: selectedPriceId,
          timingId: selectedTimingId,
          qty: selectedQty
        };

        console.log(createBooking);

        const booking = await bookEvent(createBooking);

        if (booking) {
          setToastData({
            success: true,
            message: 'Successfully booked the event'
          });
        } else {
          setToastData({
            success: false,
            message: 'Failed to book an event'
          });
        }
      }
      await wait(1.5);
      setToastData(undefined);
      router.push('/my-bookings');
    } catch (err: any) {
      console.log(err);
    }
  };

  if (isLoading) {
    return <div className='text-center'>Loading...</div>;
  }

  return (
    <div className='mx-6'>
      <div className='flex flex-col w-full lg:flex-row'>
        <div className='grid flex-grow max-h-96 w-80 card bg-base-300 rounded-box place-items-center'>
          <div className='carousel w-full h-full'>
            {event?.photos
              ? event.photos.map((photo, idx, photos) => (
                  <div
                    key={idx}
                    id={`${idx}`}
                    className='carousel-item relative w-full'
                  >
                    <Image
                      src={photo.photoUrl}
                      alt={'event-photo'}
                      height={200}
                      width={200}
                      className='w-full object-cover'
                    />
                    <div className='absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2'>
                      <Link
                        href={`#${idx == 0 ? photos.length - 1 : idx - 1}`}
                        className='btn btn-circle'
                      >
                        ❮
                      </Link>
                      <Link
                        href={`#${(idx + 1) % photos.length}`}
                        className='btn btn-circle'
                      >
                        ❯
                      </Link>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>

        <div className='divider lg:divider-horizontal'></div>

        <div className='grid flex-grow h-auto p-4 card bg-base-300 rounded-box '>
          <div>
            <h2 className='text-2xl font-bold mb-4'>{event?.name}</h2>
            <h3 className='mb-2'>{`By: ${
              event?.organization && event.organization.name
            }`}</h3>
            {/* <div>
              <span>
                {`Date: ${
                  event?.timings[0].date
                    ? DateService.getDateString(
                        new Date(event?.timings[0].date)
                      )
                    : null
                }`}
              </span>
              <span>{` from ${event?.timings[0].startTime} - ${event?.timings[0].endTime}`}</span>
            </div> */}

            <div className='form-control my-4'>
              <label className='label'>
                <span className='label-text'>Select the price</span>
              </label>
              <select
                name='price'
                className='select select-info w-full max-w-xs'
                onChange={handleSelectChange}
                value={selectedPriceId}
              >
                {event?.prices &&
                  event.prices.map((price) => (
                    <option key={price.id} value={price.id}>
                      {price.price === 0
                        ? 'Free'
                        : `${price.currency.toUpperCase()} ${price.price}`}
                    </option>
                  ))}
              </select>
            </div>

            <div className='form-control my-4'>
              <label className='label'>
                <span className='label-text'>Select date & time</span>
              </label>
              <select
                name='timing'
                className='select select-info w-full max-w-xs'
                onChange={handleSelectChange}
                value={selectedTimingId}
              >
                {event?.timings &&
                  event.timings.map((timing) => (
                    <option key={timing.id} value={timing.id}>
                      {`${DateService.getDateString(
                        new Date(timing.date)
                      )} from ${timing.startTime} - ${timing.endTime}`}
                    </option>
                  ))}
              </select>
            </div>

            <div className='form-control my-4'>
              <label className='label'>
                <span className='label-text'>Select quantity</span>
              </label>
              <select
                name='qty'
                className='select select-info w-full max-w-xs'
                onChange={handleSelectChange}
                value={selectedQty}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
                  <option key={qty}>{qty}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type='button'
            className='btn btn-block btn-outline btn-success mt-2'
            onClick={() => {
              const my_modal_2 = document?.getElementById('my_modal_2') as {
                showModal: Function;
              } | null;
              my_modal_2?.showModal();
            }}
          >
            Register
          </button>
        </div>
      </div>

      <div className='divider'></div>

      <div>
        <div className='my-4'>
          <h2 className='text-lg font-bold'>Description</h2>
          <p>{event?.description}</p>
        </div>

        <div className='my-4'>
          <h2 className='text-lg font-bold'>Location</h2>
          <p>{event?.venue}</p>
          <p>{`${event?.city}, ${event?.state}`}</p>
          <p>{event?.country}</p>
        </div>

        <div className='my-4'>
          <h2 className='text-lg font-bold'>Category</h2>
          {event?.category.split(',').map((category) => (
            <div key={category} className='badge badge-primary badge-outline'>
              {category}
            </div>
          ))}
        </div>
      </div>

      <div className='divider'></div>

      <div className='flex justify-center my-6'>
        <div className='card card-compact w-96 bg-base-100 shadow-xl'>
          <figure className='p-4'>
            <div className='avatar w-full justify-center'>
              <div className='w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-slate-400'>
                {event?.organization?.photoUrl ? (
                  <Image
                    src={event?.organization?.photoUrl}
                    alt='photo'
                    width={200}
                    height={200}
                  />
                ) : null}
              </div>
            </div>
          </figure>
          <div className='card-body'>
            <h2 className='card-title'>{event?.organization?.name}</h2>
            <p>{event?.organization?.description}</p>
            <p className='mt-2 flex justify-between'>
              <span>{`Email: ${event?.organization?.email}`}</span>
              <span>{`Contact no.: ${event?.organization?.contactNo}`}</span>
            </p>
          </div>
        </div>
      </div>

      <div className='divider'></div>

      <dialog id='my_modal_2' className='modal'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Order Summary</h3>
          <div className='mt-2'>
            <h2 className='font-bold'>{event?.name}</h2>
            <p>
              {selectedTiming ? (
                <span>
                  {`Date: ${DateService.getDateString(
                    new Date(selectedTiming.date)
                  )} from ${selectedTiming.startTime} - ${
                    selectedTiming.endTime
                  }`}
                </span>
              ) : null}
            </p>
          </div>
          <p className='py-4 flex justify-between'>
            <span>
              {`${selectedPrice?.currency.toUpperCase()} ${selectedPrice?.price}x${selectedQty}`}
            </span>
            <span>{`Total: ${
              selectedPrice?.price! * selectedQty
            } ${selectedPrice?.currency.toUpperCase()}`}</span>
          </p>
          <form method='dialog' className='flex gap-4'>
            <button
              type='submit'
              className='btn btn-outline btn-error flex-grow'
            >
              close
            </button>
            <button
              type='button'
              className='btn btn-outline btn-success flex-grow'
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </form>
        </div>
      </dialog>

      <Toast toastData={toastData} />
    </div>
  );
}

export default Event;
