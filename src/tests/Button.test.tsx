import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Button from '../components/ui/Button';

describe('Button', () => {
  it('renders and triggers click handler', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Play now</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Play now' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
