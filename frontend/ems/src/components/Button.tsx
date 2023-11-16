type TButtonProps = {
  children: string;
  handleClick: Function;
  type: 'submit' | 'reset' | 'button';
  className?: string;
};
function Button({ children, handleClick, type, className }: TButtonProps) {
  return (
    <div className='form-control mt-6'>
      <button
        type={type}
        className={`btn btn-primary ${className}`}
        onClick={() => handleClick()}
      >
        {children}
      </button>
    </div>
  );
}

export { Button };
