'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/utils';

export type HotListingCardProps = {
  __typename: string;
  id: number;
  title: string;
  price: number;
  images: string;
  location: string;
  category: string;
  subCategory: string;
  sex: string;
  age: number;
  ageUnit: string;
  createdAt: Date;
};

export default function HotListingCard(props: HotListingCardProps) {
  const {
    id,
    title,
    price,
    images,
    location,
    category,
    subCategory,
    createdAt,
    sex,
    age,
    ageUnit,
  } = props;

  const transformedImages = JSON.parse(images);

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  return (
    <li className="flex h-fit w-full gap-1 rounded-sm bg-white p-1 shadow-sm shadow-black/50 transition-all duration-300 ease-in-out hover:bg-slate-400/50">
      <div className="relative h-[155px] w-[100px]">
        {transformedImages &&
          Array.isArray(transformedImages) &&
          transformedImages.length > 0 && (
            <Image
              src={transformedImages[currentImageIndex || 0]}
              alt={title}
              width={300}
              height={200}
              className="h-full rounded-sm object-cover"
            />
          )}

        {transformedImages &&
          Array.isArray(transformedImages) &&
          transformedImages.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-1 top-[66%] size-4 -translate-y-1/2 transform"
                onClick={() =>
                  setCurrentImageIndex(prev =>
                    prev === 0 ? transformedImages.length - 1 : prev - 1,
                  )
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="absolute right-1 top-[66%] size-4 -translate-y-1/2 transform"
                onClick={() =>
                  setCurrentImageIndex(prev =>
                    prev === transformedImages.length - 1 ? 0 : prev + 1,
                  )
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

        <span className="absolute left-0 top-0 rounded-br-lg bg-yellow-500 px-1 py-[2px] text-xs font-medium text-slate-800">
          {price} MAD
        </span>
        <span className="absolute bottom-0 right-0 flex items-center gap-1 rounded-tl-lg bg-white/50 px-1 py-0.5 text-sm font-medium text-white">
          {transformedImages.length} <Camera className="size-4" />
        </span>
      </div>
      <div className="flex w-full flex-1 flex-col justify-between gap-4 px-1 text-sm">
        <h5 className="line-clamp-2 truncate text-wrap text-base font-bold">
          {title}
        </h5>
        <div className="mb-2 flex flex-col capitalize">
          <div className="flex items-center justify-between">
            <span className="flex max-w-[50%] flex-nowrap items-center">
              {category === 'CAT' ? (
                <>🐱</>
              ) : category === 'DOG' ? (
                <>🐶</>
              ) : (
                <>🐦</>
              )}
              <span className="line-clamp-1 font-medium">
                {subCategory.toLocaleLowerCase()}
              </span>
            </span>
            <div className="flex items-center gap-1">
              <span className="font-semibold">
                {sex === 'MALE' ? '🚹' : '🚺'}
              </span>
              <span className="font-medium">{sex.toLocaleLowerCase()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              📅
              <span className="font-medium">
                {age} {ageUnit.toLowerCase()}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <span className="font-semibold">📍</span>
              <span className="font-medium">{location}</span>
            </span>
          </div>
        </div>

        <div className="flex w-full items-center justify-between pb-2">
          <div className="text-xs font-medium italic">
            {formatDateTime(createdAt).dateDay}
          </div>
          <Link href={`/market/${id}`}>
            <Button className="flex h-6 bg-gray-700 px-1 py-0 text-xs">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </li>
  );
}
