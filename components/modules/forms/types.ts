import { z } from 'zod';
import { createListingSchema, updateListingSchema } from './validations';

export type CreateListingFormProps = {
  ownerId: number;
};

export type CreateListingInput = z.infer<typeof createListingSchema>;

export type FormErrors = {
  [K in keyof CreateListingInput]?: string[];
} & {
  submit?: string[];
};

export type UpdateListingInput = z.infer<typeof updateListingSchema> & {
  id: number;
  images: any;
  boosted: boolean;
  indexingFailed: boolean;
  owner: {
    id: number;
  };
};

export interface UpdateListingFormProps {
  listing: UpdateListingInput;
  userId: number;
}
