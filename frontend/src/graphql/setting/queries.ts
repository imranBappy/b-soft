import { gql } from "@apollo/client";


export const SETTING_QUERY = gql`
    query MyQuery($id: ID!) {
        websiteinfo(id: $id) {
            email
            facebook
            id
            instagram
            linkedin
            location
            phone
            x
            whatsappLink
        }
    }
`;

export const SLIDERS_QUERY = gql`
query MyQuery($first: Int, $offset: Int) {
  sliders(first: $first, offset: $offset) {
    totalCount
    edges {
      node {
        createdAt
        id
        image
        link
      }
    }
  }
}`