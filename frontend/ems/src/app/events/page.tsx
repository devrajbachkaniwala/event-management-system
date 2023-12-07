'use client';

import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { EventDto } from '@/dto/event.dto';
import { getAllEvents } from '@/utils/getAllEvents';
import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';

function EventsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<EventDto[]>();
  const [filteredEvents, setFilteredEvents] = useState<EventDto[]>();

  useEffect(() => {
    getAllEvents()
      .then((events) => {
        console.log(events);
        setEvents(events);
        setFilteredEvents(events);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setFilteredEvents(
      (prevFilteredEvents) =>
        events?.filter((event) => {
          const value = e.target.value.toLowerCase();
          return (
            event.name.toLowerCase().includes(value) ||
            event.description.toLowerCase().includes(value) ||
            event.category.toLowerCase().includes(value)
          );
        })
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='mx-auto max-w-2xl'>
      <div className='form-control flex-row'>
        <input
          type='text'
          placeholder='Search'
          className='input input-bordered w-24 md:w-auto flex-1'
          name='searchValue'
          onChange={handleSearch}
        />
        <button type='button' className='btn btn-ghost btn-circle'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </button>
      </div>

      <div className='my-8 gap-6 w-full'>
        {filteredEvents && filteredEvents.length ? (
          filteredEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card
                id={event.id}
                title={event.name}
                description={event.description}
                photoUrl={event.photos[0]?.photoUrl}
                tags={event.category}
                className='card-side w-full mt-6'
              />
            </Link>
          ))
        ) : (
          <div className='text-center'>No events</div>
        )}
      </div>
    </div>
  );
}

export default EventsPage;
