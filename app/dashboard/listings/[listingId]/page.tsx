import { redirect } from 'next/navigation';

import { getClient } from '@/graphql/server/helpers/client';
import { GET_LISTING_BY_ID } from '@/graphql/queries/listing';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/actions/user.actions';

export default async function ListingPage({
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
    <div className="flex flex-col gap-6">
      <p>Hello from ListingPage: {listingId} </p>
      <h1 className="text-center text-4xl font-medium text-slate-900">
        {listing.title}
      </h1>
    </div>
  );
}
