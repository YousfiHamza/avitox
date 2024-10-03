'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Trash2,
  Pencil,
  Camera,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDateTime } from '@/lib/utils';
import { Listing } from '@prisma/client';
import clsx from 'clsx';

type ListingCardProps = {
  listing: Listing;
  user: any;
  inDashboard?: boolean;
  handleDelete?: (listingId: number) => void;
  handleBoost?: (listing: Listing) => void;
  setRouteLoading?: (loading: boolean) => void;
};

export default function ListingCard({
  listing,
  user,
  inDashboard,
  handleDelete,
  handleBoost,
  setRouteLoading,
}: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  return (
    <Card
      key={listing.id}
      className={clsx(
        'relative flex w-full overflow-hidden border-gray-300 shadow-md shadow-black/50 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:translate-x-1 hover:shadow-2xl hover:shadow-black',
        {
          'border-2 border-yellow-500 bg-yellow-400/40': listing.boosted,
        },
      )}
    >
      <div className="relative h-[300px] w-[250px]">
        {listing.images &&
          Array.isArray(listing.images) &&
          listing.images.length > 0 && (
            <Image
              src={(listing.images as Array<string>)[currentImageIndex || 0]}
              alt={listing.title}
              width={300}
              height={200}
              className="h-full object-cover"
            />
          )}

        {listing.images &&
          Array.isArray(listing.images) &&
          listing.images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 size-6 -translate-y-1/2 transform"
                onClick={() =>
                  setCurrentImageIndex(prev =>
                    prev === 0
                      ? (listing.images as Array<string>).length - 1
                      : prev - 1,
                  )
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="absolute right-2 top-1/2 size-6 -translate-y-1/2 transform"
                onClick={() =>
                  setCurrentImageIndex(prev =>
                    prev === (listing.images as Array<string>).length - 1
                      ? 0
                      : prev + 1,
                  )
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

        <span className="absolute left-0 top-0 rounded-br-lg bg-yellow-500 px-2 py-1 font-medium text-slate-800">
          {listing.price} MAD
        </span>
        <span className="absolute bottom-0 right-0 flex gap-2 rounded-tl-lg bg-white/50 px-1 py-0.5 font-medium text-white">
          {(listing.images as Array<string>).length} <Camera />
        </span>
      </div>

      <div className="flex flex-1 flex-col capitalize">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="line-clamp-1 truncate text-2xl font-bold">
            {listing.title}
          </CardTitle>
          <div>
            {setRouteLoading && (
              <Link href={`/dashboard/listings/${listing.id}/update`}>
                <Button
                  onClick={() => setRouteLoading(true)}
                  variant="outline"
                  size="icon"
                  className="mr-2 bg-green-700 text-white hover:bg-green-500 hover:text-white"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {handleDelete && (
              <Button
                onClick={() => handleDelete(listing.id)}
                variant="outline"
                size="icon"
                className="bg-red-600 text-white hover:bg-red-400 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {!inDashboard && listing.boosted && <span>⚡</span>}
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-2 flex items-center gap-8">
            <span className="flex items-center">
              {listing.category === 'CAT' ? (
                <>🐱</>
              ) : listing.category === 'DOG' ? (
                <>🐶</>
              ) : (
                <>🐦</>
              )}
              <span className="font-medium">
                <span className="font-bold">{listing.category}</span> -{' '}
                {listing.subCategory.toLocaleLowerCase()}
              </span>
            </span>
            <span className="flex items-center gap-1">
              📅
              <span className="font-medium">
                {listing.age} {listing.ageUnit.toLocaleLowerCase()}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <span className="font-semibold">
                {listing.sex === 'MALE' ? '🚹' : '🚺'}
              </span>
              <span className="font-medium">
                {listing.sex.toLocaleLowerCase()}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <span className="font-semibold">📍</span>
              <span className="font-medium">{listing.location}</span>
            </span>
          </div>
          <p className="line-clamp-2 max-w-full truncate text-wrap">
            {listing.description}
          </p>
        </CardContent>

        <CardFooter className="mt-auto flex items-end justify-between text-gray-800">
          <div className="flex flex-col gap-4">
            {inDashboard ? (
              <p className="text-sm font-medium italic">
                {formatDateTime(listing.createdAt).dateTime}
              </p>
            ) : (
              <div className="flex items-center">
                <Avatar className="mr-2 h-10 w-10">
                  <AvatarImage src={user.photo || undefined} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-xl font-medium">{user.username}</p>
                  <p className="text-sm font-medium italic">
                    {formatDateTime(listing.createdAt).dateTime}
                  </p>
                </div>
              </div>
            )}
          </div>

          {!listing.boosted && inDashboard && handleBoost && (
            <Button
              onClick={() => handleBoost(listing)}
              className="flex gap-2 bg-yellow-600 hover:bg-yellow-500"
            >
              <Zap className="h-4 w-4" />
              Boost
            </Button>
          )}
          {!inDashboard && (
            <Link href={`/market/${listing.id}`}>
              <Button className="flex gap-2 bg-gray-800">Learn More</Button>
            </Link>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}
