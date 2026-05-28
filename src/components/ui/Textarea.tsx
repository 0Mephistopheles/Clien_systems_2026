import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, label, hint, id, ...props }, ref) => {
  const resolvedId = id ?? props.name;

  return (
    <label className="field" htmlFor={resolvedId}>
      {label ? <span className="field__label">{label}</span> : null}
      <textarea ref={ref} id={resolvedId} className={cn('field__textarea', className)} {...props} />
      {hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
