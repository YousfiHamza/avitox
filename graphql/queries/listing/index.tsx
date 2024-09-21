import { gql } from '@apollo/client';

export const CREATE_LISTING_MUTATION = gql`
  mutation createListing($input: CreateListingInput!) {
    createListing(data: $input) {
      title
      description
    }
  }
`;
