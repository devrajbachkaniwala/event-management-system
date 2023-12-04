'use client';
import { Loading } from '@/components/Loading';
import { fetchProfile } from '@/redux/features/authSlice';
import { useAppDispatch } from '@/redux/store';
import { AuthService } from '@/services/auth-service';
import { LocalStorageService } from '@/services/local-storage-service';
import { getProfile } from '@/utils/getProfile';
import { login } from '@/utils/login';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

function LoginPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string>('');
  const router = useRouter();

  const dispatch = useAppDispatch();

  useEffect(() => {
    getProfile().then((user) => {
      if (user) {
        router.replace('/');
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);

      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      const loginCredentials: TLoginCredentials = {
        email,
        password
      };

      const res = await login(loginCredentials);
      const user = await dispatch(fetchProfile()).unwrap();

      if (user) {
        router.replace('/');
      }
    } catch (err: any) {
      console.log(err);
      setErrMsg(err.message);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='hero min-h-screen bg-base-200'>
      <div className='hero-content flex-col lg:flex-row-reverse'>
        <div className='text-center lg:text-left'>
          <h1 className='text-5xl font-bold'>Login now!</h1>
          <p className='py-6'>
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
        <div className='card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
          <form className='card-body' onSubmit={handleSubmit}>
            {errMsg ? (
              <span className='text-red-700 font-bold text-center'>
                {errMsg}
              </span>
            ) : null}

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Email</span>
              </label>
              <input
                type='email'
                placeholder='email'
                className='input input-bordered'
                name='email'
                required
              />
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Password</span>
              </label>
              <input
                type='password'
                placeholder='password'
                className='input input-bordered'
                name='password'
                required
              />
              <label className='label'>
                <Link
                  href='/register'
                  className='label-text-alt link link-hover'
                >
                  Create account
                </Link>
              </label>
            </div>
            <div className='form-control mt-6'>
              <button type='submit' className='btn btn-primary'>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;