import Image from 'next/image';
import ListingCard from '@/components/modules/listing-card';
import { getListings } from '@/lib/actions/listing.actions';

import Pagination from '@/components/modules/pagination';

type Filters = {
  category?: string;
  sex?: string;
  minAge?: string;
  maxAge?: string;
  keywords?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
};

export async function MarketContent({
  searchParams,
}: {
  searchParams: Filters;
}) {
  const listings = await getListings(searchParams);

  if (!listings || listings.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center">
        <Image
          src="/images/not-found.webp"
          width={333}
          height={333}
          alt="empty search illustration"
        />
        <p className="mt-6 text-lg font-medium">
          Sorry, but No Listing is Matching this Filter!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {listings.map(listing => (
        <ListingCard
          key={listing.id}
          listing={listing}
          user={{ ...listing.owner, username: listing.owner.username }}
        />
      ))}
      {listings.length > 10 && (
        <div className="my-10">
          <Pagination />
        </div>
      )}
    </div>
  );
}
