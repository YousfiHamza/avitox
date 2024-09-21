import { z } from 'zod';

import { CATEGORIESMAP } from '@/lib/constants';

export const imageSchema = z.object({
  dataUrl: z.string().url(),
  name: z.string(),
});

export const createListingSchema = z
  .object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(1000),
    price: z.number().positive(),
    images: z.array(imageSchema).min(1).max(5),
    location: z.enum([
      'Casablanca',
      'Rabat',
      'Fes',
      'Tangier',
      'Marrakesh',
      'Agadir',
      'Meknes',
      'Oujda',
      'Kenitra',
      'Tetouan',
    ]),
    category: z.enum(['DOG', 'CAT', 'BIRD']),
    subCategory: z.enum([
      'LABRADOR',
      'BULLDOG',
      'PUG',
      'PERSIAN',
      'BIRMAN',
      'EXOTIC',
      'PIGEON',
      'CANARY',
      'PARROT',
    ]),
    sex: z.enum(['MALE', 'FEMALE', 'UNKNOWN']),
    age: z.number().int().positive(),
    ageUnit: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']).default('YEAR'),
    status: z.enum(['ACTIVE', 'SOLD', 'EXPIRED']).default('ACTIVE'),
    boosted: z.boolean().default(false),
  })
  .refine(data => CATEGORIESMAP[data.category].includes(data.subCategory), {
    message: 'Selected subcategory does not belong to the chosen category',
    path: ['subCategory'],
  });
