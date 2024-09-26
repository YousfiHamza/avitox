import { redirect } from 'next/navigation';

import { getClient } from '@/graphql/server/helpers/client';
import { GET_LISTING_BY_ID } from '@/graphql/queries/listing';

export default async function SingleListingPage({
  params,
}: {
  params: { listingId: string };
}) {
  const listingId = parseInt(params.listingId, 10);

  // Fetch the listing data using Apollo Client
  const { data, error } = await getClient().query({
    query: GET_LISTING_BY_ID,
    variables: { id: listingId },
  });

  const listing = data?.listing;

  if (error || !listing) {
    console.error('Error fetching listing:', error);
    redirect('/market');
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="font-mono">Hello from ListingPage: {listingId} </p>
      <h1 className="text-center font-serif text-5xl font-bold capitalize text-slate-900">
        {listing.title}
      </h1>
    </div>
  );
}
