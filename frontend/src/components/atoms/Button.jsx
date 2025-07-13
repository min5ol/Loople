export default function Button({ children, onClick, variant = 'primary' })
{
  return(
    <button className={`w-60 py-3 rounded-full ${variant === 'primary'} ? 'bg-primary text-background' : bg-background text-primary border border-primary'}`} onClick={onClick}>
      {children}
    </button>
  );
}