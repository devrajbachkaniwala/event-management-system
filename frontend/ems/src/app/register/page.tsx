'use client';
import { RegisterUserDto } from '@/dto/register-user.dto';
import { AuthService } from '@/services/auth-service';
import { FileValidatorService } from '@/services/file-validator-service';
import { getProfile } from '@/utils/getProfile';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

function Register() {
  const [isLoading, setIsLoading] = useState(true);

  const [photoFile, setPhotoFile] = useState<File>();
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoErrMsg, setPhotoErrMsg] = useState('');

  const [errMsg, setErrMsg] = useState('');

  const router = useRouter();

  useEffect(() => {
    getProfile().then((user) => {
      if (user) {
        router.replace('/');
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  const resolver = classValidatorResolver(RegisterUserDto);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<RegisterUserDto>({
    resolver
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

  const onSubmit: SubmitHandler<RegisterUserDto> = async (
    data: RegisterUserDto
  ) => {
    try {
      const res = await AuthService.register(data, photoFile);
      console.log(res);
      router.push('/login');
    } catch (err: any) {
      setErrMsg(err.message);
    }
  };

  if (isLoading) {
    return <div className='text-center'>Loading...</div>;
  }

  return (
    <div className='hero min-h-screen bg-base-200'>
      <div className='hero-content flex-col lg:flex-row-reverse'>
        <div className='text-center lg:text-left'>
          <h1 className='text-5xl font-bold'>Register now!</h1>
          <p className='py-6'>
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
        <div className='card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
          <form className='card-body' onSubmit={handleSubmit(onSubmit)}>
            <div className='form-control w-full max-w-xs'>
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
              <input
                type='file'
                className='file-input file-input-bordered w-full max-w-xs'
                onChange={handleUserPhoto}
              />
              {photoErrMsg ? (
                <label className='label'>
                  <span className='label-text-alt error-msg'>
                    {photoErrMsg}
                  </span>
                </label>
              ) : null}
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Username</span>
              </label>
              <input
                type='text'
                placeholder='username'
                className='input input-bordered'
                required
                {...register('username')}
              />
              {errors.username ? (
                <label className='label'>
                  <span className='label-text-alt error-msg'>
                    {errors.username.message}
                  </span>
                </label>
              ) : null}
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Full Name</span>
              </label>
              <input
                type='text'
                placeholder='Full name'
                className='input input-bordered'
                required
                {...register('fullName')}
              />
              {errors.fullName ? (
                <label className='label'>
                  <span className='label-text-alt error-msg'>
                    {errors.fullName.message}
                  </span>
                </label>
              ) : null}
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Email</span>
              </label>
              <input
                type='email'
                placeholder='email'
                className='input input-bordered'
                required
                {...register('email')}
              />
              {errors.email ? (
                <label className='label'>
                  <span className='label-text-alt error-msg'>
                    {errors.email.message}
                  </span>
                </label>
              ) : null}
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Password</span>
              </label>
              <input
                type='password'
                placeholder='password'
                className='input input-bordered'
                required
                {...register('password')}
              />
              {errors.password ? (
                <label className='label'>
                  <span className='label-text-alt error-msg'>
                    {errors.password.message}
                  </span>
                </label>
              ) : null}
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Confirm Password</span>
              </label>
              <input
                type='password'
                placeholder='Confirm password'
                className='input input-bordered'
                required
                {...register('confirmPassword')}
              />
              {errors.confirmPassword ? (
                <label className='label'>
                  <span className='label-text-alt error-msg'>
                    {errors.confirmPassword.message}
                  </span>
                </label>
              ) : null}

              <label className='label'>
                <Link href='/login' className='label-text-alt link link-hover'>
                  Already have an account?
                </Link>
              </label>
            </div>

            <div className='form-control mt-6'>
              {errMsg ? (
                <span className='error-msg text-center mb-1'>{errMsg}</span>
              ) : null}
              <button type='submit' className='btn btn-primary'>
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
