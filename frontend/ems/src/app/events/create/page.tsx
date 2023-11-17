'use client';

import { EventForm } from '@/components/EventForm';
import { getProfile } from '@/utils/getProfile';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function EventCreate() {
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    getProfile().then((u) => {
      if (!u) {
        router.replace('/login');
      } else if (!u?.orgId) {
        router.replace('/organization/create');
      } else if (u?.orgId) {
        setIsLoading(false);
      }
    });
  }, [router]);

  if (isLoading) {
    return <div className='text-center'>Loading...</div>;
  }

  return (
    <div className='mx-6'>
      <h2 className='font-bold text-2xl text-center my-6'>Create an event</h2>
      <div className=''>
        <EventForm isEditForm={false} />
      </div>
    </div>
  );
}

export default EventCreate;
