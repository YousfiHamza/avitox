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

export const SEARCH_LISTINGS_QUERY = gql`
  query searchListings($filters: ListingFilterInput) {
    searchListings(filters: $filters) {
      id
      title
      description
      price
      images
      boosted
      location
      owner {
        id
        username
        photo
      }
      sex
      age
      ageUnit
      category
      subCategory
      createdAt
    }
  }
`;

export const GET_HOT_LISTING_BY_USER_ID = gql`
  query hotListings($userId: Int!) {
    hotListings(userId: $userId) {
      id
      title
      price
      images
      location
      category
      subCategory
      createdAt
      sex
      age
      ageUnit
    }
  }
`;
