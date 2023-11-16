import Image from 'next/image';
import Link from 'next/link';

type TCardProps = {
  id: string;
  title: string;
  description: string;
  tags: string;
  photoUrl: string;
  className?: string;
};

function Card({
  id,
  title,
  description,
  tags,
  photoUrl,
  className
}: TCardProps) {
  return (
    <Link href={`/events/${id}`}>
      <div className={`card w-96 bg-base-100 shadow-xl ${className}`}>
        <figure className='object-cover max-w-full h-56'>
          <Image
            src={photoUrl}
            alt={title}
            width={200}
            height={200}
            className='w-full'
          />
        </figure>
        <div className='card-body'>
          <h2 className='card-title'>{title}</h2>
          <p>{description}</p>
          <div className='card-actions justify-end'>
            {tags.split(',').map((tag) => (
              <div className='badge badge-outline' key={tag}>
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export { Card };
