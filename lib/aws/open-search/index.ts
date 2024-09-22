import { Listing } from '@prisma/client';
import opensearchClient from './client';

export const createIndexIfNotExists = async (indexName: string) => {
  const { body: exists } = await opensearchClient.indices.exists({
    index: indexName,
  });
  if (!exists) {
    await opensearchClient.indices.create({
      index: indexName,
      body: {
        mappings: {
          properties: {
            title: { type: 'text' },
            description: { type: 'text' },
            price: { type: 'float' },
            location: { type: 'keyword' },
            category: { type: 'keyword' },
            subCategory: { type: 'keyword' },
            sex: { type: 'keyword' },
            age: { type: 'integer' },
            ageUnit: { type: 'keyword' },
            images: { type: 'keyword' },
            status: { type: 'keyword' },
            ownerId: { type: 'integer' },
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' },
          },
        },
      },
    });
    console.log(`Index "${indexName}" created`);
  } else {
    console.log(`Index "${indexName}" already exists`);
  }
};

export const IndexListing = async (listing: Listing) => {
  const indexName = 'listings'; // Ensure this index exists in OpenSearch

  const response = await opensearchClient.index({
    index: indexName,
    id: listing.id.toString(),
    body: {
      ...listing,
    },
  });

  // Refresh the index to make the document searchable immediately
  await opensearchClient.indices.refresh({ index: indexName });

  console.log('Listing indexed successfully:', response.body);
};
