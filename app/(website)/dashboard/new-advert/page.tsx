import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function NewAdvertPageage() {
  const { userId } = auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  const user = await getUserById(userId);

  if (!user) {
    return redirect('/sign-in');
  }

  return <div>Hello from New Advert: {user.firstName}</div>;
}
