import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, hint, id, ...props }, ref) => {
  const resolvedId = id ?? props.name;

  return (
    <label className="field" htmlFor={resolvedId}>
      {label ? <span className="field__label">{label}</span> : null}
      <input ref={ref} id={resolvedId} className={cn('field__input', className)} {...props} />
      {hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
});

Input.displayName = 'Input';

export default Input;
