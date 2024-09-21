import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

export default function NewAdvertPageage() {
  const { userId } = auth();

  if (!userId) {
    return redirect('/auth/sign-in');
  }

  return <div>Hello from New Advert</div>;
}
