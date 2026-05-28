import { type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: 'sm' | 'md' | 'lg';
};

export default function Card({ className, padding = 'md', ...props }: CardProps) {
  return <div className={cn('card', `card--${padding}`, className)} {...props} />;
}
