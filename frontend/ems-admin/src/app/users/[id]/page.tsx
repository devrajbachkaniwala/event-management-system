'use client';

import { EventBookingCard } from '@/components/EventBookingCard';
import { Loading } from '@/components/Loading';
import { BookingDto } from '@/dto/booking.dto';
import { UserDto } from '@/dto/user.dto';
import { RootState, useAppDispatch } from '@/redux/store';
import { TokenService } from '@/services/token-service';
import { getUser } from '@/utils/getUser';
import { moderateUser } from '@/utils/moderateUser';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

type TUserPageProps = {
  params: {
    id: string;
  };
};

function UserPage({ params }: TUserPageProps) {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');
  const [user, setUser] = useState<UserDto>();

  const [activeBookings, setActiveBookings] = useState<BookingDto[]>();
  const [cancelledBookings, setCancelledBookings] = useState<BookingDto[]>();

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (authUser && authUser.role !== 'ADMIN') {
      TokenService.removeAllTokens();
      router.replace('/login');
    } else if (!authUser) {
      router.replace('/login');
      //   setIsLoading(false);
    }
  }, [authUser, router, setIsLoading]);

  useEffect(() => {
    getUser(params.id)
      .then((user) => {
        if (user) {
          setUser(user);
          setIsEnable(user.isActive);

          if (user.bookings) {
            const active: BookingDto[] = [];
            const cancelled: BookingDto[] = [];

            user.bookings.forEach((booking) => {
              if (booking.status === 'ACTIVE') {
                active.push(booking);
              } else if (booking.status === 'CANCEL') {
                cancelled.push(booking);
              }
            });

            setActiveBookings(active);
            setCancelledBookings(cancelled);
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.id]);

  const [isEnable, setIsEnable] = useState(user?.isActive);

  useEffect(() => {
    if (user) {
      setIsEnable(user.isActive);
    }
  }, [user]);

  const handleUserEnable = async () => {
    const user = await moderateUser(params.id, { isActive: !isEnable });
    console.log(user);
    if (user) {
      setUser(user);
    }
  };

  if (isLoading || !user) {
    return <Loading />;
  }

  return (
    <div className='my-4'>
      <div className='flex justify-center'>
        <div className='lg:w-2/5 md:w-1/2 w-full'>
          <div className='card w-full bg-base-100 shadow-xl'>
            <div className='form-control w-full '>
              <label className='label mb-3'>
                <div className='avatar w-full justify-center'>
                  <div className='w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-slate-400'>
                    {user.userPhotoUrl ? (
                      <Image
                        src={user.userPhotoUrl}
                        alt='user photo'
                        width={200}
                        height={200}
                      />
                    ) : null}
                  </div>
                </div>
              </label>
            </div>

            <div className='p-4 flex flex-col'>
              <div className='form-control'>
                <div className='flex justify-between'>
                  <label htmlFor='username' className='label'>
                    <span className='label-text'>Username</span>
                  </label>
                  <input
                    id='username'
                    type='text'
                    placeholder='username'
                    className='input input-bordered input-md w-full max-w-xs flex-grow'
                    disabled
                    value={user.username}
                  />
                </div>
              </div>

              <div className='form-control my-2'>
                <div className='flex justify-between'>
                  <label htmlFor='fullName' className='label'>
                    <span className='label-text'>Full Name</span>
                  </label>
                  <input
                    id='fullName'
                    type='text'
                    placeholder='Full name'
                    className='input input-bordered input-md w-full max-w-xs flex-grow'
                    disabled
                    value={user.fullName}
                  />
                </div>
              </div>

              <div className='form-control'>
                <div className='flex justify-between'>
                  <label htmlFor='email' className='label'>
                    <span className='label-text'>Email</span>
                  </label>
                  <input
                    id='email'
                    type='email'
                    placeholder='email'
                    className='input input-bordered input-md w-full max-w-xs flex-grow'
                    disabled
                    value={user.email}
                  />
                </div>
              </div>

              <div className='form-control mt-6'>
                {errMsg ? (
                  <span className='error-msg text-center mb-1'>{errMsg}</span>
                ) : null}

                <div className='flex justify-between gap-2'>
                  <button
                    type='button'
                    className={`btn btn-outline flex-1 ${
                      isEnable ? 'btn-error' : 'btn-info'
                    }`}
                    onClick={handleUserEnable}
                  >
                    {isEnable ? 'Disable' : 'Enable'}
                  </button>

                  {/* <button
                    type='button'
                    className='btn btn-outline btn-error flex-1'
                  >
                    Delete
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-2xl my-6'>
        <div>
          <h3 className='font-semibold text-xl text-center'>Active Bookings</h3>
          <div className='my-8 gap-6 w-full'>
            {activeBookings && activeBookings.length ? (
              activeBookings.map(
                (booking) =>
                  booking.event &&
                  booking.price &&
                  booking.timing && (
                    <EventBookingCard
                      key={booking.id}
                      id={booking.id}
                      price={booking.price}
                      timing={booking.timing}
                      booking={booking}
                      event={booking.event}
                      className='card-side w-full mt-6'
                    />
                  )
              )
            ) : (
              <div className='text-center'>No active bookings</div>
            )}
          </div>
        </div>

        <div>
          <h3 className='font-semibold text-xl text-center'>
            Cancelled Bookings
          </h3>
          <div className='my-8 gap-6 w-full'>
            {cancelledBookings && cancelledBookings.length ? (
              cancelledBookings.map(
                (booking) =>
                  booking.event &&
                  booking.price &&
                  booking.timing && (
                    <EventBookingCard
                      key={booking.id}
                      id={booking.id}
                      price={booking.price}
                      timing={booking.timing}
                      booking={booking}
                      event={booking.event}
                      className='card-side w-full mt-6'
                    />
                  )
              )
            ) : (
              <div className='text-center'>No cancelled bookings</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
