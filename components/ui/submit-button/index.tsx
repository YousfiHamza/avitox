'use client';

import { cn } from '@/lib/utils';

export default function SubmitButton({
  pending,
  className = '',
}: {
  pending: boolean;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'w-full rounded-md border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50',
        className,
      )}
    >
      {pending ? 'Creating...' : 'Create Listing'}
    </button>
  );
}
