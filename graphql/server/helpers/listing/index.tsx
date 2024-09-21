import { CreateListingInput } from '@/graphql/types';
import { stat } from 'fs';

export const handleCreateListing = async (data: CreateListingInput) => {
  console.log('data', {
    ...data,
    images: undefined,
  });
  const myReturn = {
    title: data.title,
    description: data.description,
    price: data.price,
    boosted: data.boosted,
    status: data.status,
    age: data.age,
    ageUnit: data.ageUnit,
  };
  return myReturn;
};
