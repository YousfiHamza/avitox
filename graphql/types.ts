import {
  CategoryEnum,
  SubCategoryEnum,
  SexEnum,
  ListingStatusEnum,
  TransactionStatusEnum,
  AgeUnitEnum,
} from '@prisma/client'; // Ensure you import enums if needed

export interface User {
  id: number;
  clerkId: string;
  email: string;
  username: string;
  photo: string | null; // Change this to string | null
  firstName: string;
  lastName: string;
  coins: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  images: any; // Adjust the type based on your JSON structure
  location: string;
  boosted: boolean;
  category: CategoryEnum; // or CategoryEnum if you have a specific type
  subCategory: SubCategoryEnum; // or SubCategoryEnum if you have a specific type
  sex: SexEnum; // or SexEnum if you have a specific type
  age: number;
  ageUnit: AgeUnitEnum;
  status: ListingStatusEnum; // or ListingStatusEnum if you have a specific type
  ownerId: number;
}

export interface Transaction {
  id: number;
  buyerId: number;
  sellerId: number;
  transactionId: string;
  price: number;
  status: string; // or TransactionStatusEnum if you have a specific type
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  images: any;
  location: string;
  category: CategoryEnum;
  subCategory: SubCategoryEnum;
  sex: SexEnum;
  age: number;
  ageUnit: AgeUnitEnum;
  status: ListingStatusEnum;
  boosted: boolean;
  ownerId: number;
}

export interface CreateTransactionInput {
  buyerId: number;
  sellerId: number;
  transactionId: string;
  price: number;
  status: TransactionStatusEnum; // Ensure status is included
}
