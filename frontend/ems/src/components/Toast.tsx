type TToastProps = {
  toastData?: TToast;
};

function Toast({ toastData }: TToastProps) {
  if (!toastData) {
    return null;
  }

  return (
    <div className='toast toast-end'>
      <div
        className={`alert ${
          toastData.success ? 'alert-success' : 'alert-error'
        }`}
      >
        <span>{toastData.message}</span>
      </div>
    </div>
  );
}

export { Toast };
