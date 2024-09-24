import { gql } from '@apollo/client';

export const CREATE_LISTING_MUTATION = gql`
  mutation createListing($input: CreateListingInput!) {
    createListing(data: $input) {
      id
      title
    }
  }
`;

export const GET_LISTING_BY_ID = gql`
  query GetListingById($id: Int!) {
    listing(id: $id) {
      id
      title
      description
      price
      images
      location
      category
      subCategory
      sex
      age
      ageUnit
      owner {
        id
      }
    }
  }
`;

export const UPDATE_LISTING_MUTATION = gql`
  mutation UpdateListing($input: UpdateListingInput!) {
    updateListing(input: $input) {
      id
      title
      description
      price
      images
      location
      category
      subCategory
      sex
      age
      ageUnit
    }
  }
`;

export const DELETE_LISTING_MUTATION = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;
