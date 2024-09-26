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
      boosted
      status
      owner {
        id
      }
    }
  }
`;

export const UPDATE_LISTING_MUTATION = gql`
  mutation updateListing($input: UpdateListingInput!) {
    updateListing(data: $input) {
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
      boosted
      createdAt
    }
  }
`;

export const DELETE_LISTING_MUTATION = gql`
  mutation deleteListing($listingId: Int!, $userId: Int!) {
    deleteListing(listingId: $listingId, userId: $userId) {
      id
    }
  }
`;

export const HANDLE_BOOST_MUTATION = gql`
  mutation handleBoostListing($data: BoostListingInput!) {
    handleBoostListing(data: $data) {
      id
      boosted
    }
  }
`;
