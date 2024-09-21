import { z } from 'zod';
import { createListingSchema } from './validations';
import { ListingStatusEnum } from '@prisma/client';

export type CreateListingFormProps = {
  ownerId: number;
};

export type CreateListingInput = z.infer<typeof createListingSchema>;

export type FormErrors = {
  [K in keyof CreateListingInput]?: string[];
} & {
  submit?: string[];
};
