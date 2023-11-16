'use client';

import { EventForm } from '@/components/EventForm';

function EventCreate() {
  return (
    <div className='mx-6'>
      <h2 className='font-bold text-2xl text-center my-6'>Create an event</h2>
      <div className=''>
        <EventForm />
      </div>
    </div>
  );
}

export default EventCreate;
