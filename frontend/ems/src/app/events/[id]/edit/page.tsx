'use client';

import { EventForm } from '@/components/EventForm';
import { Loading } from '@/components/Loading';
import { getEvent } from '@/utils/getEvent';
import { getOrgEvents } from '@/utils/getOrgEvents';
import { getProfile } from '@/utils/getProfile';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type TEventEditProps = {
  params: {
    id: string;
  };
};

function EventEditPage({ params: { id } }: TEventEditProps) {
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const validateOrg = async () => {
      const [event, user] = await Promise.all([getEvent(id), getProfile()]);
      if (!user) {
        router.replace('/login');
      } else if (!user?.orgId) {
        router.replace('/organization/create');
      } else if (user.orgId !== event?.orgId) {
        router.replace('/');
      } else {
        setIsLoading(false);
      }
    };

    validateOrg();
  }, [router, id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='mx-6'>
      <h2 className='font-bold text-2xl text-center my-6'>Edit an event</h2>
      <div className=''>
        <EventForm isEditForm={true} eventId={id} />
      </div>
    </div>
  );
}

export default EventEditPage;
