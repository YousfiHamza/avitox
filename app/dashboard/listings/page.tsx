import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { PlusIcon } from 'lucide-react';

import ListingsList from '@/components/modules/listings-list';
import { Button } from '@/components/ui/button';

import { getUserByClerkId } from '@/lib/actions/user.actions';

export const dynamic = 'force-dynamic';

export default async function ListingsPage() {
  const { userId } = auth();

  const user = await getUserByClerkId(userId);

  if (!user) {
    console.error('Error fetching listings:');
    redirect('/dashboard/listings');
  }

  return (
    <div className="mx-auto flex w-full flex-1 flex-col items-center gap-6 rounded-lg bg-white p-6 shadow-md shadow-black/40">
      <div className="mb-4 flex w-full items-center justify-between">
        <span className="font-serif text-4xl font-semibold capitalize text-blue-800">
          Welcome {user.username} 👋🏼
        </span>
        <Button
          asChild
          className="w-fit bg-rose-700 text-white shadow-transparent hover:bg-rose-600 hover:shadow-sm hover:shadow-rose-600"
        >
          <Link
            href={
              user.listings.length > 3
                ? '/dashboard/store'
                : '/dashboard/listings/new'
            }
            className="self-stretch"
          >
            <PlusIcon className="mr-2 font-bold text-white" /> New Listing
          </Link>
        </Button>
      </div>
      <ListingsList user={user} inDashboard />
    </div>
  );
}
