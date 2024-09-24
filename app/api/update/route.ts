import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma'; // Adjust the import path as necessary
import opensearchClient from '@/lib/aws/open-search/client';
import { Listing } from '@prisma/client';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('deleting all indexes');
    async function deleteIndex(indexName: string) {
      try {
        const response = await opensearchClient.indices.delete({
          index: indexName,
        });
        console.log(`Index ${indexName} deleted:`, response.body);
      } catch (error) {
        console.error('Error deleting index:', error);
      }
    }

    async function deleteAllIndexes() {
      try {
        const { body: indices } = await opensearchClient.cat.indices({
          format: 'json',
        });
        for (const index of indices as any) {
          await deleteIndex(index.index);
        }
        console.log('All indexes deleted.');
      } catch (error) {
        console.error('Error deleting all indexes:', error);
      }
    }

    await deleteIndex('listings');

    res.status(200).json({ message: 'Listings updated successfully' });
  } catch (error) {
    console.error('Error updating listings:', error);
    res.status(500).json({ error: 'Failed to update listings' });
  }
}
