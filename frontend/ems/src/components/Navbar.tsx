'use client';

import { fetchProfile, resetAuthState } from '@/redux/features/authSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { logout } from '@/utils/logout';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      const res = await logout();
      dispatch(resetAuthState());
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className='navbar bg-base-100'>
      <div className='flex-1'>
        <Link href={'/'} className='btn btn-ghost text-xl'>
          Event Management System
        </Link>
      </div>

      {user ? (
        <div className='flex-none'>
          <Link
            href={user.orgId ? '/events/create' : '/organization/create'}
            className='btn btn-ghost'
          >
            Create an event
          </Link>
          {user.orgId ? (
            <div className='dropdown dropdown-end'>
              <div tabIndex={0} className='btn btn-ghost'>
                Organization
              </div>
              <ul
                tabIndex={0}
                className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
              >
                <li>
                  <Link href={'/organization/edit'} className='justify-between'>
                    Edit organization
                  </Link>
                </li>
                <li>
                  <a href='/organization/events'>My events</a>
                </li>
              </ul>
            </div>
          ) : null}

          <div className='mx-2'>{user.username}</div>
          <div className='dropdown dropdown-end'>
            <label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
              <div className='w-10 rounded-full bg-slate-400'>
                {user?.userPhotoUrl ? (
                  <Image
                    src={user?.userPhotoUrl}
                    alt={user.fullName}
                    height={200}
                    width={200}
                    className='w-full h-full'
                  />
                ) : null}
              </div>
            </label>
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
            >
              <li>
                <Link href={'/profile/edit'} className='justify-between'>
                  Edit profile
                </Link>
              </li>
              <li>
                <a href='/my-bookings'>My bookings</a>
              </li>
              <li>
                <a href='/login' onClick={handleLogout}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <Link href={'/login'} className='btn btn-outline mr-2 btn-success'>
            {' '}
            Login{' '}
          </Link>
        </div>
      )}
    </div>
  );
}
