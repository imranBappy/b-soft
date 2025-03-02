import { gql } from "@apollo/client";



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
}
`
export const SLIDER_QUERY = gql`
query MyQuery($id: ID!) {
  slider(id: $id) {
        createdAt
        id
        image
        link
  }
}
`