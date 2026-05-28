import { type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'accent';
};

export default function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return <span className={cn('badge', `badge--${tone}`, className)} {...props} />;
}
