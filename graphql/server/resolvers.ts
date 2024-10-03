// graphql/resolvers.ts
import prisma from '@/prisma';
import { GraphQLScalarType, Kind } from 'graphql';

import {
  User,
  Listing,
  Transaction,
  CreateListingInput,
  CreateTransactionInput,
  UpdateListingInput,
  ListingFilterInput,
} from '../types';

import {
  handleBoostListing,
  handleCreateListing,
  handleDeleteListing,
  handleQueryFilteredListings,
  handleUpdateListing,
} from './helpers/listing';

const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime scalar type',
  parseValue(value: unknown): Date {
    // Assume the input is a string and convert it to a Date object
    return new Date(value as string);
  },
  serialize(value: unknown): string {
    // Ensure that the value is a Date object and serialize it as an ISO string
    return (value as Date).toISOString();
  },
  parseLiteral(ast): Date | null {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value); // Convert string literal to Date
    }
    return null;
  },
});

const Json = new GraphQLScalarType({
  name: 'Json',
  description: 'Json scalar type',
  parseValue(value: unknown): any {
    // Convert the value to a JSON object
    return typeof value === 'string' ? JSON.parse(value) : value;
  },
  serialize(value: unknown): string {
    // Convert JSON object back to string for the response
    return JSON.stringify(value);
  },
  parseLiteral(ast): any {
    if (ast.kind === Kind.STRING) {
      return JSON.parse(ast.value); // Convert string literal to JSON
    }
    return null;
  },
});

export const resolvers = {
  DateTime,
  Json,
  Query: {
    users: async (): Promise<User[]> => {
      return await prisma.user.findMany();
    },
    user: async (_: any, { id }: { id: number }): Promise<User | null> => {
      return await prisma.user.findUnique({
        where: { id },
      });
    },
    listings: async (): Promise<Listing[]> => {
      return await prisma.listing.findMany();
    },
    listing: async (
      _: any,
      { id }: { id: number },
    ): Promise<Listing | null> => {
      return await prisma.listing.findUnique({
        where: { id },
      });
    },
    transactions: async (): Promise<Transaction[]> => {
      return await prisma.transaction.findMany();
    },
    transaction: async (
      _: any,
      { id }: { id: number },
    ): Promise<Transaction | null> => {
      return await prisma.transaction.findUnique({
        where: { id },
      });
    },
    searchListings: async (
      _: any,
      {
        filters,
      }: {
        filters: ListingFilterInput;
      },
    ): Promise<Listing[]> => {
      return handleQueryFilteredListings(filters);
    },
    hotListings: async (
      _: any,
      { userId }: { userId: number },
    ): Promise<Listing[]> => {
      return await prisma.listing.findMany({
        where: {
          ownerId: {
            not: userId,
          },
        },
        take: 3,
        orderBy: {
          createdAt: 'desc',
        },
      });
    },
  },

  Mutation: {
    createUser: async (_: any, { data }: { data: User }): Promise<User> => {
      return await prisma.user.create({
        data,
      });
    },
    updateUser: async (_: any, { data }: { data: User }): Promise<User> => {
      const { id, ...updateData } = data; // Extract ID for the update
      return await prisma.user.update({
        where: { id },
        data: updateData,
      });
    },
    deleteUser: async (_: any, { id }: { id: number }): Promise<User> => {
      return await prisma.user.delete({
        where: { id },
      });
    },

    createListing: async (
      _: any,
      { data }: { data: CreateListingInput },
    ): Promise<Listing | undefined> => {
      return handleCreateListing(data);
    },

    updateListing: async (
      _: any,
      { data }: { data: UpdateListingInput },
    ): Promise<Listing | undefined> => {
      return handleUpdateListing(data);
    },

    deleteListing: async (
      _: any,
      { listingId, userId }: { listingId: number; userId: number },
    ): Promise<Listing | null> => {
      return handleDeleteListing(listingId, userId);
    },

    handleBoostListing: async (
      _: any,
      {
        data,
      }: { data: { listingId: number; userId: number; boostValue: boolean } },
    ): Promise<Listing | undefined> => {
      console.log('IN handleboostListing RESOLVER');
      return handleBoostListing(data.listingId, data.userId, data.boostValue);
    },

    createTransaction: async (
      _: any,
      { data }: { data: CreateTransactionInput },
    ): Promise<Transaction> => {
      return await prisma.transaction.create({
        data,
      });
    },
  },

  User: {
    listings: async (parent: User): Promise<Listing[]> => {
      return await prisma.listing.findMany({
        where: { ownerId: parent.id },
      });
    },
    transactionsAsBuyer: async (parent: User): Promise<Transaction[]> => {
      return await prisma.transaction.findMany({
        where: { buyerId: parent.id },
      });
    },
    transactionsAsSeller: async (parent: User): Promise<Transaction[]> => {
      return await prisma.transaction.findMany({
        where: { sellerId: parent.id },
      });
    },
  },

  Listing: {
    owner: async (parent: Listing): Promise<User | null> => {
      return await prisma.user.findUnique({
        where: { id: parent.ownerId },
      });
    },
  },

  Transaction: {
    buyer: async (parent: Transaction): Promise<User | null> => {
      return await prisma.user.findUnique({
        where: { id: parent.buyerId },
      });
    },
    seller: async (parent: Transaction): Promise<User | null> => {
      return await prisma.user.findUnique({
        where: { id: parent.sellerId },
      });
    },
  },
};
