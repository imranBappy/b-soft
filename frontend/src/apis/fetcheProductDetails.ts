import { API } from '@/constants';

const query = `
query MyQuery($id: ID ,$slug: String) {
   product(id: $id, slug: $slug) {
    id
    slug
    updatedAt
    tag
    shortDescription
    price
    photo
    name
    isActive
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
`;
export default async function fetchProductDetails(slug: string) {
    return await fetch(API, {
        method: 'POST',
        body: JSON.stringify({
            query: query,
            variables: {
                slug: slug,
            },
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json());
}
