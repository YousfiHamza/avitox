// lib/api.ts
import { SEARCH_LISTINGS_QUERY } from '@/graphql/queries/listing';

import { getClient } from '@/graphql/server/helpers/client';
import { Listing } from '@prisma/client';

type ListingWithOwner = Listing & {
  owner: { id: number; username: string; photo: string };
};

export async function getListings(filters: any): Promise<ListingWithOwner[]> {
  try {
    const myFilters = {
      category: filters.category as string,
      sex: filters.sex as string,
      location: filters.location as string,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      minAge: filters.minAge ? Number(filters.minAge) : undefined,
      maxAge: filters.maxAge ? Number(filters.maxAge) : undefined,
      keywords: filters.keywords as string,
    };

    const { data } = await getClient().query({
      query: SEARCH_LISTINGS_QUERY,
      variables: { filters: myFilters },
    });

    return data.searchListings.map((listing: ListingWithOwner) => {
      if (listing)
        return { ...listing, images: JSON.parse(listing.images as string) };
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}
