import { API } from "@/constants"

const query = `
query MyQuery($id: ID!, $first: Int, $offset: Int) {
  product(id: $id) {
    updatedAt
    tag
    shortDescription
    price
    photo
    name
    isActive
    id
    createdAt
    descriptions {
      totalCount
      edges {
        node {
          description
          id
          label
          tag
        }
      }
    }
    category {
      description
      id
      image
      isActive
      name
      createdAt
    }
    attributes {
      totalCount
      edges {
        node {
          createdAt
          id
          name
          attributeOptions {
            totalCount
            edges {
              node {
                createdAt
                id
                option
                photo
                extraPrice
                message
              }
            }
          }
        }
      }
    }
    offerPrice
    priceRange
    reviews(first: $first, offset: $offset) {
      totalCount
      edges {
        node {
          content
          id
          rating
          user {
            name
            phone
            id
          }
          createdAt
        }
      }
    }
    faqs {
      edges {
        node {
          answer
          id
          question
        }
      }
    }
  }
}
`
export default async function fetchProductDetails(id: string) {
    return await fetch(API, {
        method: "POST",
        body: JSON.stringify({
            query: query,
            variables: {
                id: id
            }
        }),
        headers: {
            "Content-Type": "application/json",
        },
    }
    ).then((res) => res.json())
}