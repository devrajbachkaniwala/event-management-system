import { BookingDto } from '@/dto/booking.dto';
import { EventPriceDto } from '@/dto/event-price.dto';
import { EventTimingDto } from '@/dto/event-timing.dto';
import { EventDto } from '@/dto/event.dto';
import Image from 'next/image';
import Link from 'next/link';

type TEventBookingCardProps = {
  id: string;
  price: EventPriceDto;
  timing: EventTimingDto;
  booking: BookingDto;
  event: EventDto;
  className?: string;
  handleCancel: () => Promise<void>;
};

function EventBookingCard({
  id,
  className,
  price,
  timing,
  booking,
  event,
  handleCancel
}: TEventBookingCardProps) {
  return (
    <div className={`card w-96 bg-base-100 shadow-xl ${className}`}>
      <figure className='object-cover max-w-sm h-56'>
        <Image
          src={event.photos[0].photoUrl}
          alt={event.name}
          width={200}
          height={200}
          className='w-full max-w-sm'
        />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>{event.name}</h2>
        <p>{`${event.description.slice(0, 200)}...`}</p>
        <div className=''>
          <span className='font-bold'>Location: </span>
          <span>{`${event.city}, ${event.state}, ${event.country}`}</span>
        </div>

        <div>
          <span className='font-bold'>Booked: </span>
          <span className='inline-flex justify-between'>
            <span>
              {`${price.currency.toUpperCase()} ${price.price}x${booking.qty}`}

              {` = ${
                price.price * booking.qty
              } ${price.currency.toUpperCase()}`}
            </span>
          </span>
          <div>
            <span className='font-bold'>Status</span>
            {
              <span
                className={`${
                  booking.status === 'ACTIVE'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >{`: ${booking.status}`}</span>
            }
          </div>
        </div>

        <div className='card-actions justify-between align-middle'>
          <div className='self-center flex gap-2'>
            {event.category.split(',').map((tag) => (
              <div className='badge badge-outline self-center ml-1' key={tag}>
                {tag}
              </div>
            ))}
          </div>

          <div>
            <button
              className='btn btn-sm btn-outline btn-error'
              disabled={booking.status === 'CANCEL' ? true : false}
              onClick={(e) => {
                e.preventDefault();

                handleCancel();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { EventBookingCard };
