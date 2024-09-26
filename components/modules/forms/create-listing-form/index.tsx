/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { Trash2, Upload, Plus } from 'lucide-react';

import { CREATE_LISTING_MUTATION } from '@/graphql/queries/listing';

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

import {
  CreateListingFormProps,
  CreateListingInput,
  FormErrors,
} from '../types';
import { createListingSchema } from '../validations';

export default function CreateListingForm({ ownerId }: CreateListingFormProps) {
  const [createListing, { loading }] = useMutation(CREATE_LISTING_MUTATION);
  const [category, setCategory] = useState<keyof typeof CATEGORIESMAP | ''>('');
  const [images, setImages] = useState<CreateListingInput['images']>([]);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();

  const handleCategoryChange = (value: string) => {
    setCategory(value as keyof typeof CATEGORIESMAP);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = await Promise.all(
        Array.from(files).map(async file => ({
          dataUrl: await readFileAsDataURL(file),
          name: file.name,
        })),
      );
      setImages(prev => [...prev, ...newImages]);
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

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});

    const formData = new FormData(e.currentTarget);
    const listingData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      images: images,
      location: formData.get('location') as CreateListingInput['location'],
      category: formData.get('category') as CreateListingInput['category'],
      subCategory: formData.get(
        'subCategory',
      ) as CreateListingInput['subCategory'],
      sex: formData.get('sex') as CreateListingInput['sex'],
      age: Number(formData.get('age')),
      ageUnit: formData.get('ageUnit') as CreateListingInput['ageUnit'],
      status: 'ACTIVE',
      boosted: false,
    };

    const validationResult = createListingSchema.safeParse(listingData);

    if (!validationResult.success) {
      setFormErrors(validationResult.error.flatten().fieldErrors as FormErrors);
      toast.error('Please fix the form errors First.');
      return;
    }

    try {
      const { data } = await createListing({
        variables: {
          input: {
            ...listingData,
            images: images.map(img => img.dataUrl),
            status: 'ACTIVE',
            ownerId,
          },
        },
      });
      toast.success('Listing created successfully!');
      // Redirect to Update Page
      router.push('/dashboard/listings');
      router.refresh();
      // Empty the form in case the routing is slow
      formRef.current?.reset();
      setCategory('');
      setImages([]);
      setFormErrors({});
    } catch (err) {
      console.error('Error creating listing:', err);
      toast.error('Failed to create listing!');
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mx-auto w-full">
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
        />
        {formErrors.description && (
          <p className="mt-1 py-2 text-sm font-medium text-destructive">
            {formErrors.description[0]}
          </p>
        )}
      </div>

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
          {images.slice(0, 5).map((image, index) => (
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
                  onClick={() => removeImage(index)}
                  variant="destructive"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6 hover:brightness-150"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {images.slice(5, images.length).map((image, index) => (
            <Card key={index} className="relative">
              <CardContent className="relative h-36 w-36 p-0">
                <div className="absolute h-full w-full bg-black opacity-75"></div>
                <Image
                  height={144}
                  width={144}
                  src={image.dataUrl}
                  alt={image.name}
                  className="h-full w-full rounded object-cover"
                />
                <Button
                  type="button"
                  onClick={() => removeImage(index)}
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
          <Select name="category" required onValueChange={handleCategoryChange}>
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
          <Select name="subCategory" required disabled={!category}>
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
          <Select name="location" required>
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
            <Select name="sex" required>
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
            <Select name="ageUnit" required>
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
        />
        {formErrors.price && (
          <p className="mt-1 py-2 text-sm font-medium text-destructive">
            {formErrors.price[0]}
          </p>
        )}
      </div>

      <div className="text-center">
        <CustomButton
          type="submit"
          disabled={loading}
          className="w-full px-3 py-2 text-lg md:w-auto"
        >
          {loading ? (
            'Creating...'
          ) : (
            <div className="flex items-center gap-2">
              <Plus />
              Create Listing
            </div>
          )}
        </CustomButton>
      </div>
    </form>
  );
}
