import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileSliders, ArrowLeft } from 'lucide-react';

import UpdateListingForm from '@/components/modules/forms/update-listing-form';

import { getClient } from '@/graphql/server/helpers/client';
import { GET_LISTING_BY_ID } from '@/graphql/queries/listing';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/actions/user.actions';

export default async function UpdateListingPage({
  params,
}: {
  params: { listingId: string };
}) {
  const { userId } = auth();

  const listingId = parseInt(params.listingId, 10);

  // Fetch the listing data using Apollo Client
  const { data, error } = await getClient().query({
    query: GET_LISTING_BY_ID,
    variables: { id: listingId },
  });

  const user = await getUserByClerkId(userId);

  const listing = data?.listing;

  if (error || !listing || !user || listing.owner.id !== user.id) {
    console.error('Error fetching listing:', error);
    redirect('/dashboard/listings');
  }

  return (
    <div className="w-full flex-1 rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-10 flex items-center">
        <Link
          href="/dashboard/listings"
          className="flex items-center gap-2 font-medium"
        >
          <ArrowLeft size={20} /> Back to your Listings
        </Link>
        <div className="flex flex-1 items-center justify-center gap-2 text-center font-poppins text-3xl font-bold uppercase text-green-800">
          <FileSliders size={25} />
          Edit Listing
        </div>
      </div>
      <UpdateListingForm listing={listing} />
    </div>
  );
}
