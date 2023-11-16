function TimingForm() {
  return (
    <div className='my-4'>
      <div className='form-control w-full max-w-lg'>
        <div className='flex justify-between mb-2'>
          <h2>Timing Plan 1</h2>
          <button type='button' className='btn btn-sm btn-outline btn-error'>
            Delete
          </button>
        </div>
        <div className='flex justify-between'>
          <label className='label'>
            <span className='label-text'>Date</span>
          </label>
          <input
            type='date'
            min={`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
              new Date().getDate() + 1 <= 9 ? 0 : ''
            }${new Date().getDate() + 1}`}
            placeholder='Date'
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
            <span className='label-text'>Start Time</span>
          </label>
          <input
            type='time'
            placeholder='Start Time'
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
            <span className='label-text'>End Time</span>
          </label>
          <input
            type='time'
            placeholder='End Time'
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

export { TimingForm };
