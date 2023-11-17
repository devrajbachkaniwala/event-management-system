'use client';

import { FileValidatorService } from '@/services/file-validator-service';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';

type TEventPhotoFormProps = {
  index: number;
  setPhotoFile: (file: File | undefined) => void;
  remove: () => void;
  errorMsg?: string;
  photoUrl?: string;
  isEditForm: boolean;
  isFieldDisabled: boolean;
};

function EventPhotoForm({
  index,
  setPhotoFile,
  remove,
  errorMsg,
  photoUrl: imgUrl,
  isEditForm,
  isFieldDisabled
}: TEventPhotoFormProps) {
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoErrMsg, setPhotoErrMsg] = useState('');

  useEffect(() => {
    if (errorMsg && !photoUrl && !imgUrl) {
      setPhotoErrMsg(errorMsg);
    }
  }, [errorMsg, photoUrl, imgUrl]);

  useEffect(() => {
    if (isEditForm && imgUrl) {
      setPhotoUrl(imgUrl);
    }
  }, [isEditForm, imgUrl]);

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

  return (
    <div className='form-control w-full max-w-lg my-4'>
      <label className='label mb-3'>
        <div className='w-full h-52 rounded-md bg-slate-400'>
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt='photo'
              width={200}
              height={200}
              className='w-full object-cover h-52 rounded-md'
            />
          ) : null}
        </div>
      </label>
      <div className='flex justify-between'>
        <input
          type='file'
          className='file-input file-input-bordered file-input-sm w-full max-w-xs'
          onChange={handleUserPhoto}
          disabled={isFieldDisabled}
        />
        {index > 0 ? (
          <button
            type='button'
            className='btn btn-sm btn-outline btn-error'
            onClick={() => remove()}
            disabled={isFieldDisabled}
          >
            Delete
          </button>
        ) : null}
      </div>
      {photoErrMsg ? (
        <label className='label'>
          <span className='label-text-alt error-msg'>{photoErrMsg}</span>
        </label>
      ) : null}
    </div>
  );
}

export { EventPhotoForm };
