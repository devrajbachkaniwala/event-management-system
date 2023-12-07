'use client';

import { CreateOrganizationDto } from '@/dto/create-organization.dto';
import { UpdateOrganizationDto } from '@/dto/update-organization.dto';
import { fetchProfile } from '@/redux/features/authSlice';
import { useAppDispatch } from '@/redux/store';
import { FileValidatorService } from '@/services/file-validator-service';
import { createOrg } from '@/utils/createOrg';
import { editOrg } from '@/utils/editOrg';
import { getOrg } from '@/utils/getOrg';
import { getProfile } from '@/utils/getProfile';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const orgDefaultValue: CreateOrganizationDto = {
  name: '',
  description: '',
  contactNo: '',
  email: ''
};

type TOrgFormProps = {
  isEditForm: boolean;
};

function OrgForm({ isEditForm }: TOrgFormProps) {
  const [isLoading, setIsLoading] = useState(true);

  const [isFieldDisabled, setIsFieldDisabled] = useState(isEditForm);

  const [photoFile, setPhotoFile] = useState<File>();
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoErrMsg, setPhotoErrMsg] = useState('');

  const dispatch = useAppDispatch();

  const resolver = classValidatorResolver(CreateOrganizationDto);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateOrganizationDto>({
    resolver,
    defaultValues: async () => {
      if (isEditForm) {
        const org = await getOrg();

        if (org) {
          setPhotoUrl(org.photoUrl);
          setIsLoading(false);
          return org;
        }
        // else {
        //   router.push('/');
        // }
      }
      setIsLoading(false);

      return orgDefaultValue;
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

  const handleCreateOrg = async (
    createOrgDto: CreateOrganizationDto,
    photoFile: File | undefined
  ) => {
    if (!photoFile) {
      setPhotoErrMsg('Photo file is required');
      return;
    }

    const org = await createOrg(createOrgDto, photoFile);
    console.log(org);

    dispatch(fetchProfile());

    router.push('/organization/edit');
  };

  const handleEditOrg = async (
    updateOrgDto: UpdateOrganizationDto,
    photoFile: File | undefined
  ) => {
    const org = await editOrg(updateOrgDto, photoFile);
    console.log(org);

    setIsFieldDisabled(true);
  };

  const onSubmit: SubmitHandler<CreateOrganizationDto> = (data) => {
    console.log(data);
    console.log(photoFile);

    if (isEditForm) {
      handleEditOrg(data, photoFile);
    } else {
      handleCreateOrg(data, photoFile);
    }
  };

  if (isLoading) {
    return <div className='text-center'>Loading...</div>;
  }

  return (
    <>
      <h2 className='font-bold text-2xl text-center my-6'>
        {`${isEditForm ? 'Edit' : 'Create'} an organization`}
      </h2>
      <div className='flex justify-center'>
        <form
          className='lg:w-2/5 md:w-1/2 w-full'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='card w-full bg-base-100 shadow-xl'>
            <div className='form-control w-full'>
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
                {photoErrMsg ? (
                  <label className='label'>
                    <span className='label-text-alt error-msg'></span>
                    <span className='label-text-alt error-msg'>
                      {photoErrMsg}
                    </span>
                  </label>
                ) : null}
              </div>
            </div>

            <div className='p-4 flex flex-col'>
              <div className='form-control w-full'>
                <div className='flex justify-between'>
                  <label htmlFor='name' className='label'>
                    <span className='label-text'>Organization name</span>
                  </label>
                  <input
                    id='name'
                    type='text'
                    placeholder='Organization name'
                    className='input input-bordered input-md w-full max-w-xs flex-grow'
                    {...register('name')}
                    disabled={isFieldDisabled}
                  />
                </div>
                <label className='label'>
                  {errors.name ? (
                    <>
                      <span className='label-text-alt error-msg'></span>
                      <span className='label-text-alt error-msg'>
                        {errors.name.message}
                      </span>
                    </>
                  ) : null}
                </label>
              </div>

              <div className='form-control w-full'>
                <div className='flex justify-between'>
                  <label htmlFor='description' className='label'>
                    <span className='label-text'>Organization description</span>
                  </label>
                  <textarea
                    id='description'
                    className='textarea textarea-bordered textarea-md h-24 max-w-xs flex-grow'
                    placeholder='Organization description'
                    {...register('description')}
                    disabled={isFieldDisabled}
                  ></textarea>
                </div>
                <label className='label'>
                  {errors.description ? (
                    <>
                      <span className='label-text-alt error-msg'></span>
                      <span className='label-text-alt error-msg'>
                        {errors.description.message}
                      </span>
                    </>
                  ) : null}
                </label>
              </div>

              <div className='form-control w-full'>
                <div className='flex justify-between'>
                  <label htmlFor='email' className='label'>
                    <span className='label-text'>Email</span>
                  </label>
                  <input
                    id='email'
                    type='email'
                    placeholder='Email'
                    className='input input-bordered input-md w-full max-w-xs flex-grow'
                    {...register('email')}
                    disabled={isFieldDisabled}
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

              <div className='form-control w-full'>
                <div className='flex justify-between'>
                  <label htmlFor='contactNo' className='label'>
                    <span className='label-text'>Contact no.</span>
                  </label>
                  <input
                    id='contactNo'
                    type='tel'
                    placeholder='Contact no.'
                    className='input input-bordered input-md w-full max-w-xs flex-grow'
                    {...register('contactNo')}
                    disabled={isFieldDisabled}
                  />
                </div>
                <label className='label'>
                  {errors.contactNo ? (
                    <>
                      <span className='label-text-alt error-msg'></span>
                      <span className='label-text-alt error-msg'>
                        {errors.contactNo.message}
                      </span>
                    </>
                  ) : null}
                </label>
              </div>

              <div className='card-actions justify-center mt-1'>
                {isEditForm ? (
                  <button
                    type='submit'
                    className={`btn btn-block btn-outline ${
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
                ) : (
                  <button
                    type='submit'
                    className='btn btn-block btn-outline btn-success'
                  >
                    Create
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export { OrgForm };
