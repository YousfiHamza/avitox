'use client';

import { redirect } from 'next/navigation';

export default function ErrorPage() {
  return redirect('/market');
}
