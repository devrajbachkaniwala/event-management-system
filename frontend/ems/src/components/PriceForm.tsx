function PriceForm() {
  return (
    <div className='my-4'>
      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between mb-2'>
          <h2>Price Plan 1</h2>
          <button type='button' className='btn btn-sm btn-outline btn-error'>
            Delete
          </button>
        </div>
        <div className='flex justify-between'>
          <label className='label'>
            <span className='label-text'>Price</span>
          </label>
          <input
            type='number'
            min={0}
            placeholder='Price'
            className='input input-bordered input-md w-full max-w-xs flex-grow'
          />
        </div>
        <label className='label'>
          <span className='label-text-alt error-msg'></span>
          <span className='label-text-alt error-msg'>Bottom Left label</span>
        </label>
      </div>

      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between'>
          <label className='label'>
            <span className='label-text'>Currency</span>
          </label>
          <input
            type='text'
            placeholder='Currency'
            className='input input-bordered input-md w-full max-w-xs flex-grow'
          />
        </div>
        <label className='label'>
          <span className='label-text-alt error-msg'></span>
          <span className='label-text-alt error-msg'>Bottom Left label</span>
        </label>
      </div>

      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between'>
          <label className='label'>
            <span className='label-text'>Max Limit</span>
          </label>
          <input
            type='number'
            min={0}
            placeholder='Max Limit'
            className='input input-bordered input-md w-full max-w-xs flex-grow'
          />
        </div>
        <label className='label'>
          <span className='label-text-alt error-msg'></span>
          <span className='label-text-alt error-msg'>Bottom Left label</span>
        </label>
      </div>
    </div>
  );
}

export { PriceForm };
