import { getClient } from '@/graphql/server/helpers/client';
import { GET_HOT_LISTING_BY_USER_ID } from '@/graphql/queries/listing';
import HotListingCard, { HotListingCardProps } from './hot-listing-card';

export async function HotListings({ userId }: { userId: number }) {
  const { data, error } = await getClient().query({
    query: GET_HOT_LISTING_BY_USER_ID,
    variables: { userId },
  });

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <div className="min-h-[333px] w-[321px] overflow-hidden rounded-sm border-[1px] bg-slate-100 p-3 shadow-md shadow-black/50">
      <h5 className="text-xl font-bold leading-5 md:text-2xl md:leading-8 lg:text-2xl">
        🔥 Hot Listings:
      </h5>
      <ul className="mt-4 flex flex-col gap-2">
        {data.hotListings.length > 0 &&
          data.hotListings.map((listing: HotListingCardProps) => (
            <HotListingCard key={listing.id} {...listing} />
          ))}
      </ul>
    </div>
  );
}
