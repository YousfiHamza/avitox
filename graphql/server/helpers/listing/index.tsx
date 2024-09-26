import { revalidatePath } from 'next/cache';
import { PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

import {
  CreateListingInput,
  Listing,
  ListingFilterInput,
  UpdateListingInput,
} from '@/graphql/types';
import s3Client from '@/lib/aws/s3';
import {
  IndexListing,
  deleteListingFromOpenSearch,
} from '@/lib/aws/open-search';
import openSearchClient from '@/lib/aws/open-search/client';

export const handleCreateListing = async (data: CreateListingInput) => {
  const { images, ...rest } = data;

  if (!images || images.length === 0) {
    throw new Error('No images provided');
  }

  // List to keep track of uploaded image keys (for potential cleanup)
  const uploadedImageKeys: string[] = [];
  let listing = null;

  try {
    // Step 1: Upload Images to S3
    const uploadedImageUrls = await Promise.all(
      images.map(async (image: string) => {
        // Validate the image data
        if (!image.startsWith('data:image/')) {
          throw new Error('Invalid image format');
        }

        const dataUrl = image.replace(/^data:image\/\w+;base64,/, '');

        // Extract image extension using regex
        const extensionMatch = image.match(/^data:image\/(\w+);base64,/);
        const extension = extensionMatch ? extensionMatch[1] : 'jpeg';

        // Convert Data URL to buffer
        const buffer = Buffer.from(dataUrl, 'base64');

        // Generate a unique file name for the image
        const fileName = `${uuidv4()}.${extension}`;

        // Upload the image to S3
        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: fileName,
          Body: buffer,
          ContentType: `image/${extension}`,
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        // Keep track of uploaded image keys
        uploadedImageKeys.push(fileName);

        // Return the public URL of the image
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${fileName}`;
      }),
    );

    // Step 2: Begin Database Transaction
    listing = await prisma?.$transaction(async prismaTx => {
      // Store the listing in the DB with the image URLs
      const listingData = {
        ...rest,
        images: uploadedImageUrls, // Save the URLs in the database as a JSON array
      };

      const createdListing = await prismaTx.listing.create({
        data: listingData,
      });

      return createdListing;
    });

    if (!listing) {
      throw new Error('Failed to create listing to DB');
    }

    // Step 3: Index the Listing in OpenSearch
    try {
      await IndexListing(listing);
    } catch (error) {
      console.error('Error indexing in OpenSearch:', error);

      // Option B: Keep the listing and log the error
      // You can implement a retry mechanism or a background job to reindex later

      // Optionally, you can update the listing in the database to indicate indexing failed
      await prisma?.listing.update({
        where: { id: listing.id },
        data: { indexingFailed: true },
      });

      // Decide whether to inform the user or handle silently
    }

    revalidatePath('/dashboard/listings', 'layout');
    revalidatePath('/market', 'layout');

    // Return the successfully created listing
    return listing;
  } catch (error) {
    console.error('Error creating listing:', error);

    // Cleanup: Delete uploaded images from S3 if any
    if (uploadedImageKeys.length > 0) {
      await deleteImagesFromS3ByKeys(uploadedImageKeys);
    }

    throw error; // Rethrow the error after cleanup
  }
};

export const handleUpdateListing = async (data: UpdateListingInput) => {
  const { images, ...rest } = data;

  if (!prisma) {
    throw new Error('DB client is not available');
  }

  if (!images || images.length === 0) {
    throw new Error('No images provided');
  }

  // Lists to keep track of image keys and URLs
  const newUploadedImageKeys: string[] = [];
  let updatedListing = null;

  try {
    // Step 1: Fetch Existing Listing
    const existingListing = await prisma.listing.findUnique({
      where: { id: data.id },
    });
    if (!existingListing) {
      throw new Error('Listing not found');
    }

    // Step 2: Process Images
    // Separate images into existing URLs and new images (data URLs)
    const existingImageUrls = images.filter(
      (img: any) => typeof img === 'string',
    );
    const newImages = images.filter(
      (img: any) => typeof img === 'object' && img.dataUrl,
    );

    // Identify images to delete (present in existing listing but not in updated images)
    const imagesToDelete = Array.isArray(existingListing.images)
      ? existingListing.images.filter(
          (imgUrl): imgUrl is string =>
            typeof imgUrl === 'string' && !existingImageUrls.includes(imgUrl),
        )
      : [];

    // Upload new images to S3
    let newUploadedImageUrls: string[] = [];
    if (newImages.length > 0) {
      newUploadedImageUrls = await Promise.all(
        newImages.map(async (image: { dataUrl: string }) => {
          // Validate the image data
          if (!image.dataUrl.startsWith('data:image/')) {
            throw new Error('Invalid image format');
          }

          const dataUrl = image.dataUrl.replace(/^data:image\/\w+;base64,/, '');

          // Extract image extension using regex
          const extensionMatch = image.dataUrl.match(
            /^data:image\/(\w+);base64,/,
          );
          const extension = extensionMatch ? extensionMatch[1] : 'jpeg';

          // Convert Data URL to buffer
          const buffer = Buffer.from(dataUrl, 'base64');

          // Generate a unique file name for the image
          const fileName = `${uuidv4()}.${extension}`;

          // Upload the image to S3
          const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: fileName,
            Body: buffer,
            ContentType: `image/${extension}`,
          };

          await s3Client.send(new PutObjectCommand(uploadParams));

          // Keep track of uploaded image keys
          newUploadedImageKeys.push(fileName);

          // Return the public URL of the image
          return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${fileName}`;
        }),
      );
    }

    // Combine existing image URLs with new uploaded image URLs
    const allImageUrls = [...existingImageUrls, ...newUploadedImageUrls];

    // Step 3: Update the Listing in the Database
    updatedListing = await prisma.listing.update({
      where: { id: data.id },
      data: {
        ...rest,
        images: allImageUrls,
      },
    });

    // Check if the update was successful
    if (!updatedListing) {
      throw new Error('Failed to update listing in the database');
    }

    // Step 4: Index the Updated Listing in OpenSearch
    try {
      await IndexListing(updatedListing);
    } catch (error) {
      console.error('Error indexing in OpenSearch:', error);

      // Optionally, set a flag or handle reindexing later
      await prisma.listing.update({
        where: { id: updatedListing.id },
        data: { indexingFailed: true },
      });
    }

    // Step 5: Delete Removed Images from S3
    if (imagesToDelete.length > 0) {
      await deleteImagesFromS3(imagesToDelete);
    }

    revalidatePath('/dashboard/listings', 'layout');
    revalidatePath('/market', 'layout');

    // Return the successfully updated listing
    return updatedListing;
  } catch (error) {
    console.error('Error updating listing:', error);

    // Cleanup: Delete any new images that were uploaded to S3
    if (newUploadedImageKeys.length > 0) {
      await deleteImagesFromS3ByKeys(newUploadedImageKeys);
    }

    throw error; // Rethrow the error after cleanup
  }
};

export const handleDeleteListing = async (
  listingId: number,
  userId: number,
) => {
  // Fetch the listing and verify authorization
  const listing = await prisma?.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing || listing.ownerId !== userId) {
    throw new Error('Listing not found');
  }

  // Store listing data for potential re-indexing
  const listingDataBackup = { ...listing };

  // Step 1: Delete from OpenSearch
  try {
    await deleteListingFromOpenSearch(listingId);
    console.log('succesful delete from Opensearch');
  } catch (error) {
    // OpenSearch deletion failed, decide whether to proceed or halt
    console.error('OpenSearch deletion failed, aborting delete operation.');
    throw error; // Halting Operations
  }

  // Step 2: Delete from Database

  const deletedListing = await prisma?.listing.delete({
    where: { id: listingId },
  });

  if (!deletedListing) {
    console.error('Error deleting listing from database!');
    // Re-index the listing back into OpenSearch
    try {
      await IndexListing(listingDataBackup);
    } catch (indexError) {
      console.error('Error re-indexing listing into OpenSearch:', indexError);
      // Inform ADMINS ASAP !
    }
    throw new Error(
      'Failed to delete listing from database - Check If it was indexed back !',
    );
  }

  console.log('succesful delete from DB');

  // Step 3: Delete images from S3
  const imageUrls = listing.images as string[];
  const imageKeys = imageUrls.map(url => {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  });

  try {
    await deleteImagesFromS3ByKeys(imageKeys);
    console.log('succesful delete from S3');
  } catch (error) {
    // Maybe implement Cron Jobs to delete images later
    // Inform the admin or log for manual intervention
  }

  revalidatePath('/dashboard/listings', 'layout');
  revalidatePath('/market', 'layout');

  return listing;
};

export const handleBoostListing = async (
  listingId: number,
  userId: number,
  boostValue: boolean,
) => {
  try {
    const result = await prisma?.$transaction(async prismaTx => {
      // Fetch the user
      const user = await prismaTx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Check if the user has enough coins
      if (user.coins < 4) {
        throw new Error('Insufficient coins to boost the listing');
      }

      // Fetch the listing
      const listing = await prismaTx.listing.findUnique({
        where: { id: listingId },
      });

      if (!listing) {
        throw new Error('Listing not found');
      }

      // Check if the user is the owner of the listing
      if (listing.ownerId !== userId) {
        throw new Error('You are not authorized to boost this listing');
      }

      // Check if the listing is already boosted
      if (listing.boosted) {
        throw new Error('Listing is already boosted');
      }

      // Update the listing to set 'boosted' to true
      const updatedListing = await prismaTx.listing.update({
        where: { id: listingId },
        data: {
          boosted: boostValue,
        },
      });

      // Deduct 4 coins from the user's account
      await prismaTx.user.update({
        where: { id: userId },
        data: {
          coins: {
            decrement: 4,
          },
        },
      });

      return updatedListing;
    });

    // Index the updated listing in OpenSearch
    try {
      if (result) {
        await IndexListing(result);
      } else {
        throw new Error('Failed to index l- Error DB');
      }
    } catch (error) {
      console.error('Error indexing listing in OpenSearch:', error);
      // Optionally handle re-indexing later
    }

    revalidatePath('/dashboard/listings', 'layout');
    revalidatePath('/market', 'layout');

    return result;
  } catch (error) {
    console.error('Error boosting listing:', error);
    throw new Error('Error boosting listing ...');
  }
};

export const handleQueryFilteredListings = async (
  filters: ListingFilterInput,
) => {
  const from = 0;
  const size = 20;

  // Construct the OpenSearch query based on filters
  const searchParams = constructOpenSearchQuery(filters, from, size);

  try {
    const response = await openSearchClient.search(searchParams);

    const hits = response.body.hits.hits;

    // Map OpenSearch results to Listing objects
    const listings = hits.map((hit: any) => ({
      ...hit._source,
      score: hit._score,
      createdAt: new Date(hit._source.createdAt),
    }));

    return listings;
  } catch (error) {
    console.error('Error searching listings:', error);
    throw new Error('Failed to fetch listings');
  }
};

// Helper function to delete images from S3 using URLs
const deleteImagesFromS3 = async (imageUrls: string[]) => {
  const imageKeys = imageUrls.map(url => {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  });

  await deleteImagesFromS3ByKeys(imageKeys);
};

// Helper function to delete images from S3 using Keys
const deleteImagesFromS3ByKeys = async (imageKeys: string[]) => {
  if (imageKeys.length === 0) return;

  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Delete: {
      Objects: imageKeys.map(Key => ({ Key })),
      Quiet: true,
    },
  };

  await s3Client.send(new DeleteObjectsCommand(deleteParams));
};

const constructOpenSearchQuery = (
  filters: ListingFilterInput,
  from: number,
  size: number,
) => {
  const must: any[] = [];
  const should: any[] = [];
  const filter: any[] = [];

  if (filters.category) {
    filter.push({ match: { category: filters.category } });
  }

  if (filters.sex) {
    filter.push({ match: { sex: filters.sex } });
  }

  if (filters.location) {
    filter.push({ match: { location: filters.location } });
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const priceRange: any = {};
    if (filters.minPrice !== undefined) priceRange.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) priceRange.lte = filters.maxPrice;
    filter.push({ range: { price: priceRange } });
  }

  if (filters.keywords) {
    should.push({
      multi_match: {
        query: filters.keywords,
        fields: ['title^2', 'description'],
        fuzziness: 'AUTO',
      },
    });
  }

  const query: any = {
    bool: {
      must,
      filter,
      should,
      minimum_should_match: should.length > 0 ? 1 : 0,
    },
  };

  const searchParams = {
    index: 'listings',
    body: {
      from,
      size,
      query,
      sort: [
        { _score: { order: 'desc' } },
        { boosted: { order: 'desc' } },
        { createdAt: { order: 'desc' } },
      ],
    },
  };

  return searchParams;
};
