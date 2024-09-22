import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

import { CreateListingInput } from '@/graphql/types';
import s3Client from '@/lib/aws/s3';
import { IndexListing } from '@/lib/aws/open-search';

export const handleCreateListing = async (data: CreateListingInput) => {
  const { images, ...rest } = data;

  // Check if there are images to upload
  if (images && images.length > 0) {
    const uploadedImageUrls = await Promise.all(
      images.map(async (image: any) => {
        const dataUrl = image.replace(/^data:image\/\w+;base64,/, '');

        // Extract image extension using regex
        const extensionMatch = image.match(/^data:image\/(\w+);base64,/);
        const extension = extensionMatch ? extensionMatch[1] : 'jpeg';

        // Convert Data URL to buffer (Assuming `dataUrl` is a base64-encoded string)
        const buffer = Buffer.from(dataUrl, 'base64');

        // Generate a unique file name for the image
        const fileName = `${uuidv4()}.${extension}`;

        // Upload the image to S3
        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: buffer,
          ContentType: 'image/jpeg', // You can adjust this based on the image type
        };

        try {
          await s3Client.send(new PutObjectCommand(uploadParams));
          // Return the public URL of the image
          return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${fileName}`;
        } catch (error) {
          console.error('Error uploading to S3:', error);
          throw new Error('Image upload failed');
        }
      }),
    );

    // Store the listing in the DB with the image URLs
    const listingData = {
      ...rest,
      images: uploadedImageUrls, // Save the URLs in the database as a JSON array
    };

    // You can store `listingData` in your DB using Prisma here.
    const listing = await prisma?.listing.create({
      data: listingData,
    });

    if (!listing) {
      throw new Error('Failed to create listing to PostgresDB');
    }

    // Index the listing in OpenSearch
    await IndexListing(listing);

    return listing;
  }

  throw new Error('No images provided');
};
