'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PlusCircle, ArrowLeft } from 'lucide-react';

import CreateListingForm from '@/components/modules/forms/create-listing-form';

import { useUser } from '@/providers/user';

export default function NewListingPage() {
  const ctx = useUser();

  if (!ctx?.user) redirect('/auth/sign-in');

  if (ctx.user.listings.length >= 4) redirect('/dashboard/store');

  return (
    <div className="w-full flex-1 rounded-lg bg-white p-6 shadow-md shadow-black/40">
      <div className="mb-10 flex items-center">
        <Link
          href="/dashboard/listings"
          className="flex items-center gap-2 font-medium"
        >
          <ArrowLeft size={20} /> Back to your Listings
        </Link>
        <div className="flex flex-1 items-center justify-center gap-2 text-center font-poppins text-3xl font-bold uppercase text-green-800">
          <PlusCircle size={25} />
          New Listing
        </div>
      </div>
      <CreateListingForm ownerId={ctx.user.id} />
    </div>
  );
}
