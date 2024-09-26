// graphql/typeDefs.ts
import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar Json
  scalar DateTime

  # Enums
  enum CategoryEnum {
    DOG
    CAT
    BIRD
  }

  enum SubCategoryEnum {
    LABRADOR
    BULLDOG
    PUG
    PERSIAN
    BIRMAN
    EXOTIC
    PIGEON
    CANARY
    PARROT
  }

  enum SexEnum {
    MALE
    FEMALE
    UNKNOWN
  }

  enum ListingStatusEnum {
    ACTIVE
    SOLD
    EXPIRED
  }

  enum TransactionStatusEnum {
    PENDING
    COMPLETED
    REFUNDED
  }

  enum AgeUnitEnum {
    DAY
    WEEK
    MONTH
    YEAR
  }

  input ImageInput {
    url: String # Existing image URL
    dataUrl: String # New image to upload (base64 format)
    name: String # Optional name for new images
  }

  # Input types for mutations
  input CreateUserInput {
    clerkId: String!
    email: String!
    username: String!
    firstName: String!
    lastName: String!
    photo: String # Optional photo argument
  }

  input UpdateUserInput {
    id: Int!
    email: String
    username: String
    firstName: String
    lastName: String
    photo: String # Optional photo argument
  }

  input CreateListingInput {
    title: String!
    description: String!
    price: Float!
    images: Json!
    location: String!
    category: CategoryEnum!
    subCategory: SubCategoryEnum!
    sex: SexEnum!
    age: Int
    ageUnit: AgeUnitEnum!
    ownerId: Int!
    status: ListingStatusEnum!
    boosted: Boolean
  }

  input UpdateListingInput {
    id: Int!
    title: String
    description: String
    price: Float
    images: Json!
    location: String
    category: CategoryEnum
    subCategory: SubCategoryEnum
    sex: SexEnum
    age: Int
    ageUnit: AgeUnitEnum
    boosted: Boolean
    status: ListingStatusEnum
    ownerId: Int!
    indexingFailed: Boolean
  }

  input BoostListingInput {
    listingId: Int!
    userId: Int!
    boostValue: Boolean!
  }

  input ListingFilterInput {
    category: CategoryEnum
    sex: SexEnum
    minAge: Int
    maxAge: Int
    keywords: String
    location: String
    minPrice: Float
    maxPrice: Float
  }

  input PaginationInput {
    page: Int!
    limit: Int!
  }

  # Main types
  type User {
    id: Int!
    clerkId: String!
    email: String!
    username: String!
    photo: String
    firstName: String!
    lastName: String!
    coins: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    listings: [Listing!]! # User's listings
    transactionsAsBuyer: [Transaction!]! # Transactions where the user is the buyer
    transactionsAsSeller: [Transaction!]! # Transactions where the user is the seller
  }

  type Listing {
    id: Int!
    title: String!
    description: String!
    price: Float!
    images: Json! # List of images stored as JSON
    location: String!
    boosted: Boolean!
    category: CategoryEnum!
    subCategory: SubCategoryEnum!
    sex: SexEnum!
    age: Int
    ageUnit: AgeUnitEnum!
    status: ListingStatusEnum!
    owner: User! # User who owns the listing
    createdAt: DateTime!
    indexingFailed: Boolean!
  }

  type Transaction {
    id: Int!
    buyerId: Int!
    sellerId: Int!
    transactionId: String!
    price: Float!
    status: TransactionStatusEnum!
    createdAt: DateTime!
    updatedAt: DateTime!
    buyer: User! # Buyer of the transaction
    seller: User! # Seller of the transaction
  }

  type Query {
    users: [User!]! # Get all users
    user(id: Int!): User # Find one user by ID
    listings: [Listing!]! # Get all listings
    listing(id: Int!): Listing # Find one listing by ID
    transactions: [Transaction!]! # Get all transactions
    transaction(id: Int!): Transaction # Find one transaction by ID
    searchListings(filters: ListingFilterInput): [Listing!]! # Search listings based on filters
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    updateUser(data: UpdateUserInput!): User!
    deleteUser(id: Int!): User!

    createListing(data: CreateListingInput!): Listing!
    updateListing(data: UpdateListingInput!): Listing!
    deleteListing(listingId: Int!, userId: Int!): Listing!
    handleBoostListing(data: BoostListingInput!): Listing!

    createTransaction(
      buyerId: Int!
      sellerId: Int!
      transactionId: String!
      price: Float!
    ): Transaction!
  }
`;
