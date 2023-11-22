'use client';

import { UpdateUserProfileDto } from '@/dto/update-user-profile.dto';
import { fetchProfile } from '@/redux/features/authSlice';
import { useAppDispatch } from '@/redux/store';
import { FileValidatorService } from '@/services/file-validator-service';
import { editUserProfile } from '@/utils/editUserProfile';
import { getProfile } from '@/utils/getProfile';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Loading } from './Loading';

function UserProfile() {
  const [isLoading, setIsLoading] = useState(true);

  const [photoFile, setPhotoFile] = useState<File>();
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoErrMsg, setPhotoErrMsg] = useState('');

  const [isFieldDisabled, setIsFieldDisabled] = useState(true);

  const router = useRouter();

  const dispatch = useAppDispatch();

  const resolver = classValidatorResolver(UpdateUserProfileDto);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdateUserProfileDto & { email?: string }>({
    resolver,
    defaultValues: async () => {
      const user = await getProfile();

      if (user) {
        if (user.userPhotoUrl) {
          setPhotoUrl(user.userPhotoUrl);
        }
        setIsLoading(false);
        return user;
      } else {
        router.replace('/login');
      }

      return {};
    }
  });

  const handleUserPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setPhotoErrMsg('');

    const file = e.target.files && e.target.files[0];

    if (!file) {
      setPhotoFile(undefined);
      setPhotoUrl('');
      setPhotoErrMsg('');
      return;
    }

    try {
      FileValidatorService.validateSize(file);
      FileValidatorService.validateImgType(file);

      const url = URL.createObjectURL(file);

      setPhotoFile(file);
      setPhotoUrl(url);
    } catch (err: any) {
      setPhotoFile(undefined);
      setPhotoUrl('');
      setPhotoErrMsg(err.message);
      e.target.files = null;
    }
  };

  const onSubmit: SubmitHandler<
    UpdateUserProfileDto & { email?: string }
  > = async (data) => {
    console.log(data);
    console.log(photoFile);

    try {
      const res = await editUserProfile(data, photoFile);
      dispatch(fetchProfile());
    } catch (err: any) {
      console.log(err);
    }

    setIsFieldDisabled(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <h2 className='font-bold text-2xl text-center my-6'>Edit profile</h2>
      <div className='flex justify-center'>
        <form
          className='lg:w-2/5 md:w-1/2 w-full'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='card w-full bg-base-100 shadow-xl'>
            <div className='form-control w-full '>
              <label className='label mb-3'>
                <div className='avatar w-full justify-center'>
                  <div className='w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-slate-400'>
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt='photo'
                        width={200}
                        height={200}
                      />
                    ) : null}
                  </div>
                </div>
              </label>

              <div className='flex flex-col items-center'>
                <input
                  type='file'
                  className='file-input file-input-bordered file-input-sm w-full max-w-xs'
                  onChange={handleUserPhoto}
                  disabled={isFieldDisabled}
                />
                <label className='label'>
                  {photoErrMsg ? (
                    <>
                      <span className='label-text-alt error-msg'></span>
                      <span className='label-text-alt error-msg'>
                        {photoErrMsg}
                      </span>
                    </>
                  ) : null}
                </label>
              </div>
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
                    {...register('username')}
                    disabled={isFieldDisabled}
                  />
                </div>
                <label className='label'>
                  {errors.username ? (
                    <>
                      <span className='label-text-alt error-msg'></span>
                      <span className='label-text-alt error-msg'>
                        {errors.username.message}
                      </span>
                    </>
                  ) : null}
                </label>
              </div>

              <div className='form-control'>
                <div className='flex justify-between'>
                  <label htmlFor='fullName' className='label'>
                    <span className='label-text'>Full Name</span>
                  </label>
                  <input
                    id='fullName'
                    type='text'
                    placeholder='Full name'
                    className='input input-bordered input-md w-full max-w-xs flex-grow'
                    {...register('fullName')}
                    disabled={isFieldDisabled}
                  />
                </div>
                <label className='label'>
                  {errors.fullName ? (
                    <>
                      <span className='label-text-alt error-msg'></span>
                      <span className='label-text-alt error-msg'>
                        {errors.fullName.message}
                      </span>
                    </>
                  ) : null}
                </label>
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
                    {...register('email')}
                    disabled={true}
                  />
                </div>
                <label className='label'>
                  {errors.email ? (
                    <>
                      <span className='label-text-alt error-msg'></span>
                      <span className='label-text-alt error-msg'>
                        {errors.email.message}
                      </span>
                    </>
                  ) : null}
                </label>
              </div>

              <div className='form-control mt-6'>
                {/*  {errMsg ? (
            <span className='error-msg text-center mb-1'>{errMsg}</span>
          ) : null} */}
                <button
                  type='submit'
                  className={`btn btn-outline ${
                    isFieldDisabled ? 'btn-info' : 'btn-success'
                  }`}
                  onClick={(e) => {
                    if (isFieldDisabled) {
                      e.preventDefault();
                      setIsFieldDisabled(false);
                    }
                  }}
                >
                  {isFieldDisabled ? 'Edit' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export { UserProfile };
