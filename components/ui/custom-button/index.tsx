'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

export default function CustomButton({
  children,
  disabled,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'w-full rounded-md border border-transparent bg-green-800 px-2 py-1 text-sm font-medium text-white shadow-sm hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:brightness-125 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
