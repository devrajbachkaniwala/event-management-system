import { Card } from '@/components/Card';
import { getAllEvents } from '@/utils/getAllEvents';
import Link from 'next/link';

export default async function Home() {
  const events = await getAllEvents();

  return (
    <main className='h-3/4'>
      <div
        className='hero h-full'
        style={{
          backgroundImage: 'url(/images/landing-page-photo.jpg)'
        }}
      >
        <div className='hero-overlay bg-opacity-60'></div>
        <div className='hero-content text-center text-neutral-content'>
          <div className='max-w-md'>
            <h1 className='mb-5 text-5xl font-bold'>Event Management System</h1>
            <p className='mb-5'>
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            {/* <button className='btn btn-primary'>Get Started</button> */}
          </div>
        </div>
      </div>
      <div className='flex mx-6 my-8 gap-6'>
        {events ? (
          events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card
                id={event.id}
                title={event.name}
                description={event.description}
                photoUrl={event.photos[0]?.photoUrl}
                tags={event.category}
              />
            </Link>
          ))
        ) : (
          <div>No events</div>
        )}
      </div>
      <div className='flex justify-center my-8'>
        <Link href={`/events`} className='btn btn-wide btn-info btn-outline'>
          View more
        </Link>
      </div>
    </main>
  );
}
