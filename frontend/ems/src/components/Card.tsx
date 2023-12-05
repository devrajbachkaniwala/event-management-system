import Image from 'next/image';

type TCardProps = {
  id: string;
  title: string;
  description: string;
  tags: string;
  photoUrl: string;
  className?: string;
  deleteEvent?: (eventId: string) => Promise<
    | {
        message: string;
      }
    | undefined
  >;
};

function Card({
  id,
  title,
  description,
  tags,
  photoUrl,
  className,
  deleteEvent
}: TCardProps) {
  return (
    <div className={`card w-96 bg-base-100 shadow-xl ${className}`}>
      <figure className='object-cover max-w-sm h-56'>
        <Image
          src={photoUrl}
          alt={title}
          width={200}
          height={200}
          className='w-full max-w-sm'
        />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>{title}</h2>
        <p>{description}</p>
        <div className='flex justify-between items-center'>
          <div className='card-actions justify-start flex-1'>
            {tags.split(',').map((tag) => (
              <div className='badge badge-outline' key={tag}>
                {tag}
              </div>
            ))}
          </div>
          {deleteEvent ? (
            <div>
              <button
                type='button'
                className='btn btn-outline btn-error btn-sm'
                onClick={(e) => {
                  e.preventDefault();
                  deleteEvent(id);
                }}
              >
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export { Card };
