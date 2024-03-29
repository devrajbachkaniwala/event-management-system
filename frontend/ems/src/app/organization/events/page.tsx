'use client';

import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { EventDto } from '@/dto/event.dto';
import { deleteEvent } from '@/utils/deleteEvent';
import { getOrgEvents } from '@/utils/getOrgEvents';
import { getProfile } from '@/utils/getProfile';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function OrgEventsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEventLoading, setIsEventLoading] = useState(true);
  const [events, setEvents] = useState<EventDto[]>();

  const router = useRouter();

  useEffect(() => {
    getProfile().then((user) => {
      if (!user) {
        router.replace('/login');
      } else if (!user?.orgId) {
        router.replace('/organization/create');
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  useEffect(() => {
    getOrgEvents()
      .then((events) => {
        setEvents(events);
      })
      .finally(() => setIsEventLoading(false));
  }, [router]);

  const handleDeleteEvent = async (eventId: string) => {
    const res = await deleteEvent(eventId);

    if (res) {
      setEvents((prev) => {
        if (prev) {
          return prev.filter((p) => p.id !== eventId);
        }
      });
    }
    return res;
  };

  if (isLoading || isEventLoading) {
    return <Loading />;
  }

  return (
    <div className='mx-6'>
      <h2 className='font-bold text-2xl text-center my-6'>My Events</h2>

      <div className='mx-auto max-w-2xl'>
        <div className='my-8 gap-6 w-full'>
          {events && events.length ? (
            events.map((event) => (
              <Link key={event.id} href={`/events/${event.id}/edit`}>
                <Card
                  id={event.id}
                  title={event.name}
                  description={event.description}
                  photoUrl={event.photos[0]?.photoUrl}
                  tags={event.category}
                  className='card-side w-full mt-6'
                  deleteEvent={handleDeleteEvent}
                />
              </Link>
            ))
          ) : (
            <div className='text-center'>No events</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrgEventsPage;
