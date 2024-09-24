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
  images: any;
  owner: {
    id: number;
  };
};

export interface UpdateListingFormProps {
  listing: UpdateListingInput;
}
