/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { Trash2, Pencil, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  DELETE_LISTING_MUTATION,
  UPDATE_LISTING_MUTATION,
} from '@/graphql/queries/listing';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import CustomButton from '@/components/ui/custom-button';

import { CATEGORIESMAP, LOCATIONS } from '@/lib/constants';

import { UpdateListingFormProps, FormErrors } from '../types';
import { updateListingSchema } from '../validations';

export default function UpdateListingForm({
  listing,
  userId,
}: UpdateListingFormProps) {
  // State
  const [canUpdate, setCanUpdate] = useState(false);
  const [updateListing, { loading }] = useMutation(UPDATE_LISTING_MUTATION);
  const [deleteListing, { loading: deleting }] = useMutation(
    DELETE_LISTING_MUTATION,
  );
  const [category, setCategory] = useState<keyof typeof CATEGORIESMAP | ''>(
    listing.category || '',
  );

  const [existingImages, setExistingImages] = useState<string[]>(
    JSON.parse(listing.images) || [],
  );
  const [newImages, setNewImages] = useState<
    { dataUrl: string; name: string }[]
  >([]);

  const [formData, setFormData] = useState({
    title: listing.title || '',
    description: listing.description || '',
    price: listing.price.toString() || '',
    location: listing.location || '',
    category: listing.category || '',
    subCategory: listing.subCategory || '',
    sex: listing.sex || '',
    age: listing.age?.toString() || '',
    ageUnit: listing.ageUnit || '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const router = useRouter();

  // Handlers
  const handleCategoryChange = (value: string) => {
    setCategory(value as keyof typeof CATEGORIESMAP);
    setFormData((prev: any) => ({
      ...prev,
      category: value,
      subCategory: '',
    }));
    if (!canUpdate) setCanUpdate(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (!canUpdate) setCanUpdate(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImagesArray = await Promise.all(
        Array.from(files).map(async file => ({
          dataUrl: await readFileAsDataURL(file),
          name: file.name,
        })),
      );
      setNewImages(prev => [...prev, ...newImagesArray]);
      if (!canUpdate) setCanUpdate(true);
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    if (!canUpdate) setCanUpdate(true);
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    if (!canUpdate) setCanUpdate(true);
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});

    const combinedImages = [...existingImages, ...newImages];

    const listingData = {
      ...formData,
      id: listing.id,
      images: combinedImages,
      price: Number(formData.price),
      age: Number(formData.age),
      status: listing.status,
      boosted: listing.boosted,
      ownerId: listing.owner.id,
    };

    const validationResult = updateListingSchema.safeParse(listingData);

    if (!validationResult.success) {
      setFormErrors(validationResult.error.flatten().fieldErrors as FormErrors);
      toast.error('Please fix the form errors First.');
      return;
    }

    try {
      const { data } = await updateListing({
        variables: {
          input: listingData,
        },
      });

      toast.success('Listing updated successfully!');
      setCanUpdate(false);
    } catch (err) {
      console.error('Error Client updating listing:', err);
      toast.error('Failed to update listing!');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteListing({
        variables: {
          listingId: listing.id,
          userId: userId,
        },
      });
      toast.success('Listing deleted successfully!');
      router.push('/dashboard/listings');
    } catch (err) {
      console.error('Error deleting listing:', err);
      toast.error('Failed to delete listing!');
    }
  };

  // Checks & Effects

  return (
    <form onSubmit={handleUpdate} className="mx-auto w-full">
      <div className="mb-8">
        <Label htmlFor="title" className="mb-2 block text-lg font-semibold">
          Title
        </Label>
        <Input
          type="text"
          id="title"
          name="title"
          required
          className="text-lg"
          placeholder="Enter a catchy title"
          value={formData.title}
          onChange={handleInputChange}
        />
        {formErrors.title && (
          <p className="mt-1 py-2 text-sm font-medium text-destructive">
            {formErrors.title[0]}
          </p>
        )}
      </div>

      <div className="mb-8">
        <Label
          htmlFor="description"
          className="mb-2 block text-lg font-semibold"
        >
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          required
          className="min-h-[150px]"
          placeholder="Describe your Item in details"
          value={formData.description}
          onChange={handleInputChange}
        />
        {formErrors.description && (
          <p className="mt-1 py-2 text-sm font-medium text-destructive">
            {formErrors.description[0]}
          </p>
        )}
      </div>

      {/* {listing.images && (
        <div className="mb-8">
          <Label htmlFor="images" className="mb-2 block text-lg font-semibold">
            Images
          </Label>
          <div className="mt-4 flex flex-wrap gap-4">
            {JSON.parse(listing.images).map((image: string, index: number) => (
              <Card key={index} className="relative">
                <CardContent className="relative h-48 w-48 p-0">
                  <Image
                    height={192}
                    width={192}
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="h-full w-full rounded object-cover"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )} */}

      <div className="mb-8">
        <Label htmlFor="images" className="mb-2 block text-lg font-semibold">
          Images
        </Label>
        <div className="flex w-full items-center justify-center">
          <label
            htmlFor="images"
            className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <Upload className="mb-3 h-10 w-10 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-s text-gray-500">
                PNG, JPG or GIF ( MAX. 800x400px )
              </p>
              <p className="mt-3 text-xs text-gray-500">1 to 5 Images</p>
            </div>
            <Input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          {/* Existing Images */}
          {existingImages.map((imageUrl, index) => (
            <Card key={index} className="relative">
              <CardContent className="relative h-36 w-36 p-0">
                <Image
                  height={144}
                  width={144}
                  src={imageUrl}
                  alt={`Image ${index}`}
                  className="h-full w-full rounded object-cover"
                />
                <Button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  variant="destructive"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6 hover:brightness-150"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {/* New Images */}
          {newImages.map((image, index) => (
            <Card key={index} className="relative">
              <CardContent className="relative h-36 w-36 p-0">
                <Image
                  height={144}
                  width={144}
                  src={image.dataUrl}
                  alt={image.name}
                  className="h-full w-full rounded object-cover"
                />
                <Button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  variant="destructive"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6 hover:brightness-150"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {formErrors.images && (
          <p className="mt-1 py-2 text-sm font-medium text-destructive">
            You need to upload 1 to 5 images maximum.
          </p>
        )}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <Label
            htmlFor="category"
            className="mb-2 block text-lg font-semibold"
          >
            Category
          </Label>
          <Select
            name="category"
            required
            onValueChange={handleCategoryChange}
            value={formData.category}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(CATEGORIESMAP).map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.category && (
            <p className="mt-1 py-2 text-sm font-medium text-destructive">
              {formErrors.category[0]}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="subCategory"
            className="mb-2 block text-lg font-semibold"
          >
            Sub Category
          </Label>
          <Select
            name="subCategory"
            required
            disabled={!category}
            value={formData.subCategory}
            onValueChange={value =>
              setFormData((prev: any) => ({ ...prev, subCategory: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a subcategory" />
            </SelectTrigger>
            <SelectContent>
              {category &&
                CATEGORIESMAP[category].map(subCat => (
                  <SelectItem key={subCat} value={subCat}>
                    {subCat}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {formErrors.subCategory && (
            <p className="mt-1 py-2 text-sm font-medium text-destructive">
              {formErrors.subCategory[0]}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="location"
            className="mb-2 block text-lg font-semibold"
          >
            Location
          </Label>
          <Select
            name="location"
            required
            value={formData.location}
            onValueChange={value =>
              setFormData((prev: any) => ({ ...prev, location: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.location && (
            <p className="mt-1 py-2 text-sm font-medium text-destructive">
              {formErrors.location[0]}
            </p>
          )}
        </div>
      </div>

      {category !== '' && (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <Label htmlFor="sex" className="mb-2 block text-lg font-semibold">
              Sex
            </Label>
            <Select
              name="sex"
              required
              value={formData.sex}
              onValueChange={value =>
                setFormData((prev: any) => ({ ...prev, sex: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="UNKNOWN">Unknown</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.sex && (
              <p className="mt-1 py-2 text-sm font-medium text-destructive">
                {formErrors.sex[0]}
              </p>
            )}
          </div>
          <div className="flex-1">
            <Label htmlFor="age" className="mb-2 block text-lg font-semibold">
              Age
            </Label>
            <Input
              type="number"
              id="age"
              name="age"
              placeholder="0"
              required
              min="0"
              value={formData.age}
              onChange={handleInputChange}
            />
            {formErrors.age && (
              <p className="mt-1 py-2 text-sm font-medium text-destructive">
                {formErrors.age[0]}
              </p>
            )}
          </div>
          <div className="flex-1">
            <Label
              htmlFor="ageUnit"
              className="mb-2 block text-lg font-semibold"
            >
              Age Unit
            </Label>
            <Select
              name="ageUnit"
              required
              value={formData.ageUnit}
              onValueChange={value =>
                setFormData((prev: any) => ({ ...prev, ageUnit: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Age Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAY">Days</SelectItem>
                <SelectItem value="WEEK">Weeks</SelectItem>
                <SelectItem value="MONTH">Months</SelectItem>
                <SelectItem value="YEAR">Years</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.ageUnit && (
              <p className="mt-1 py-2 text-sm font-medium text-destructive">
                {formErrors.ageUnit[0]}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mb-8">
        <Label htmlFor="price" className="mb-2 block text-lg font-semibold">
          Price
        </Label>
        <Input
          type="number"
          id="price"
          name="price"
          required
          min="0"
          step="0.01"
          className="text-lg"
          placeholder="Enter the price (in MAD)"
          value={formData.price}
          onChange={handleInputChange}
        />
        {formErrors.price && (
          <p className="mt-1 py-2 text-sm font-medium text-destructive">
            {formErrors.price[0]}
          </p>
        )}
      </div>

      <div className="flex items-center justify-center gap-4">
        <CustomButton
          disabled={!canUpdate || loading}
          type="submit"
          className="w-full bg-green-700 px-2 py-1 text-lg md:w-auto"
        >
          {loading ? (
            <span className="cursor-wait">Updating...</span>
          ) : (
            <div className="flex items-center gap-2">
              <Pencil size={16} />
              Update
            </div>
          )}
        </CustomButton>
        <CustomButton
          disabled={deleting}
          onClick={handleDelete}
          className="w-full bg-red-700 px-2 py-1 text-lg md:w-auto"
        >
          {deleting ? (
            <span className="cursor-wait">Deleting...</span>
          ) : (
            <div className="flex items-center gap-2">
              <Trash2 size={16} />
              Delete
            </div>
          )}
        </CustomButton>
      </div>
    </form>
  );
}
