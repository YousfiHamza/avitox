'use client';

import { useState } from 'react';
import {
  DELETE_LISTING_MUTATION,
  HANDLE_BOOST_MUTATION,
} from '@/graphql/queries/listing';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { useMutation } from '@apollo/client';

import Pagination from '@/components/modules/pagination';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserWithListings } from '@/lib/actions/user.actions';
import ListingCard from '../listing-card';
import { Listing } from '@prisma/client';

type Props = {
  user: UserWithListings;
  inDashboard?: boolean;
};

export default function ListingsList({ user, inDashboard }: Props) {
  const [listings, setListings] = useState(
    user.listings.sort(
      (a, b) =>
        new Date(b.createdAt).getSeconds() - new Date(a.createdAt).getSeconds(),
    ),
  );
  const [handleBoostListing, { loading }] = useMutation(HANDLE_BOOST_MUTATION);
  const [deleteListing, { loading: deleting }] = useMutation(
    DELETE_LISTING_MUTATION,
  );
  const [routeLoading, setRouteLoading] = useState(false);

  const router = useRouter();

  if (!listings.length) {
    return <p>No listings found</p>;
  }

  const handleSort = (value: string) => {
    let sortedListings = [...listings];
    switch (value) {
      case 'price-asc':
        sortedListings.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedListings.sort((a, b) => b.price - a.price);
        break;
      case 'date-asc':
        sortedListings.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case 'date-desc':
        sortedListings.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }
    setListings(sortedListings);
  };

  const handleDelete = async (listinId: number) => {
    try {
      const { data } = await deleteListing({
        variables: {
          listingId: listinId,
          userId: user.id,
        },
      });
      toast.success('Listing deleted successfully!');
      setListings(listings.filter(l => l.id !== data.deleteListing.id));
      router.refresh();
    } catch (err) {
      console.error('Error deleting listing:', err);
      toast.error('Failed to delete listing!');
    }
  };

  const handleBoostClick = async (listing: Listing) => {
    try {
      const { data } = await handleBoostListing({
        variables: {
          data: {
            listingId: listing.id,
            userId: user.id,
            boostValue: true,
          },
        },
      });

      toast.success('⚡ Listing Boosted successfully!');
      setListings(
        listings.map(l =>
          l.id === data.handleBoostListing.id
            ? { ...l, boosted: data.handleBoostListing.boosted }
            : l,
        ),
      );
      router.refresh();
    } catch (err) {
      console.error('Error Client Boost listing:', err);
      toast.error('Failed to boost listing!');
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <Select onValueChange={handleSort}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="date-asc">Date: Oldest First</SelectItem>
          <SelectItem value="date-desc">Date: Newest First</SelectItem>
        </SelectContent>
      </Select>

      <div className="relative flex flex-col gap-4">
        {loading ||
          routeLoading ||
          (deleting && (
            <div className="absolute bottom-0 left-0 right-0 top-0 z-20 h-full w-full bg-white/50"></div>
          ))}
        {listings.map(listing => (
          <ListingCard
            key={listing.id}
            user={user}
            inDashboard={inDashboard}
            listing={listing}
            handleDelete={handleDelete}
            handleBoost={handleBoostClick}
            setRouteLoading={setRouteLoading}
          />
        ))}
      </div>

      <div className="mt-4">
        <Pagination />
      </div>
    </div>
  );
}
