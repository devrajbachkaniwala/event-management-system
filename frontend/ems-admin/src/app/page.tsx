'use client';

import { Loading } from '@/components/Loading';
import { UserDto } from '@/dto/user.dto';
import { fetchProfile } from '@/redux/features/authSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { TokenService } from '@/services/token-service';
import { getAllUsers } from '@/utils/getAllUsers';
import { getProfile } from '@/utils/getProfile';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function HomePage() {
  const authUser = useSelector((state: RootState) => state.auth.user);

  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [filteredUsers, setfilteredUsers] = useState<UserDto[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push('/login');
    } else if (authUser.role !== 'ADMIN') {
      TokenService.removeAllTokens();
      router.push('/login');
    }
  }, [router, authUser]);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // useEffect(() => {
  //   getProfile().then((user) => {
  //     if (!user || user.role !== 'ADMIN') {
  //       router.replace('/login');
  //     } else {
  //       setIsLoading(false);
  //     }
  //   });
  // }, [router]);

  useEffect(() => {
    getAllUsers()
      .then((data) => {
        if (data) {
          const u = data.filter((d) => d.id !== authUser?.id);
          setUsers(u);
          setfilteredUsers(u);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setfilteredUsers(
      (prevFilteredUsers) =>
        users?.filter((user) => {
          const value = e.target.value.toLowerCase();
          return (
            user.fullName.toLowerCase().includes(value) ||
            user.email.toLowerCase().includes(value) ||
            user.username.toLowerCase().includes(value)
          );
        })
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='mx-6 h-4/5 my-4'>
      <div className='flex justify-center my-4'>
        <div className='form-control flex-row max-w-md'>
          <input
            type='text'
            placeholder='Search'
            className='input input-bordered w-24 md:w-auto flex-1 max-w-md'
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
      </div>

      {/* <h2 className='font-bold text-2xl text-center my-6'>Users</h2> */}

      {filteredUsers.length > 0 ? (
        <div className='flex justify-center'>
          <div className='overflow-x-auto w-3/4'>
            <table className='table'>
              {/* head */}
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className='flex items-center gap-3'>
                        <div className='avatar'>
                          <div className='mask mask-squircle bg-slate-500 w-12 h-12'>
                            {user.userPhotoUrl ? (
                              <Image
                                src={user.userPhotoUrl}
                                alt={'team member photo'}
                                width={200}
                                height={200}
                              />
                            ) : null}
                          </div>
                        </div>
                        <div>
                          <div className='font-bold'>{user.fullName}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <th>
                      <Link
                        href={`/users/${user.id}`}
                        className='btn btn-outline btn-info btn-sm'
                      >
                        show more
                      </Link>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className='text-center'>No users found</div>
      )}
    </div>
  );
}
