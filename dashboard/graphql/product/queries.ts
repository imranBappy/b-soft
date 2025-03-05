import { gql } from "@apollo/client";

export const PRODUCTS_QUERY = gql`
query PRODUCTS_QUERY($offset: Int, $search: String, $after: String, $before: String, $first: Int, $price: Decimal, $orderBy: String, $isActive: Boolean, $name: String, $priceLte: Decimal, $tag: String, $createdAtEnd: Date, $createdAtStart: Date, $category: String) {
  products(
    offset: $offset
    after: $after
    before: $before
    first: $first
    price: $price
    orderBy: $orderBy
    isActive: $isActive
    name: $name
    priceLte: $priceLte
    search: $search
    tag: $tag
    createdAtEnd: $createdAtEnd
    createdAtStart: $createdAtStart
    category: $category
  ) {
    totalCount
    edges {
      node {
        id
        name
        price
        tag
        isActive
        createdAt
        category {
          name
          id
        }
        offerPrice
        photo
        priceRange
      }
    }
  }
}
`;
export const PRODUCT_QUERY = gql`
    query PRODUCT_QUERY($id: ID!) {
        product(id: $id) {
            id
            name
            price
            priceRange
            offerPrice
            shortDescription
            photo
            tag
            isActive
            createdAt
            category {
                id
                name
            }
        }
    }
`;

export const CATEGORIES_QUERY = gql`
query CATEGORIES_QUERY($search: String, $orderBy: String, $first: Int $isActive: Boolean, $isCategory: Boolean, $offset: Int, $parent: Decimal ) {
  categories(
    search: $search
    orderBy: $orderBy
    first: $first
    isActive: $isActive
    isCategory: $isCategory
    offset: $offset
    parent: $parent
  ) {
    totalCount
    edges {
      node {
        id
        name
        isActive
        products {
          totalCount
        }
       
      }
    }
  }
}
`

export const CATEGORY_QUERY = gql`
query MyQuery($id: ID!) {
  category(id: $id) {
    id
    description
    image
    isActive
    name
   
  }
}
`

export const SUBCATEGORIES_QUERY = gql`
 query SUBCATEGORIES_QUERY($offset: Int , $first: Int, $search: String, $parentId:ID!) {
    subcategories(offset: $offset, first: $first, search: $search, parentId:$parentId) {
      totalCount
      edges {
        node {
          id
          name
          image
          description
          isActive
        }
      }
    }
  }
`

export const ORDERS_QUERY = gql`
    query MyQuery(
        $first: Int
        $orderBy: String
        $offset: Int
        $search: String
        $status: ProductOrderStatusChoices
    ) {
        orders(
            first: $first
            orderBy: $orderBy
            offset: $offset
            search: $search
            status: $status
        ) {
            totalCount
            edges {
                node {
                    id
                    createdAt
                    status
                    totalPrice
                    orderId

                    user {
                        id
                        name
                        email
                    }

                    payments {
                        totalCount
                        edges {
                            node {
                                amount
                                createdAt
                                id
                                paymentMethod
                                status
                                trxId
                            }
                        }
                    }
                    items {
                        totalCount
                        edges {
                            node {
                                price
                                quantity
                                id
                                product {
                                    id
                                    photo
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
export const ORDER_QUERY = gql`
    query MyQuery($id: ID!) {
        order(id: $id) {
            user {
                id
                name
                email
            }

            payments {
                totalCount
                edges {
                    node {
                        amount
                        createdAt
                        id
                        paymentMethod
                        status
                        trxId
                    }
                }
            }
            status
            totalPrice
            id
            createdAt

            items {
                totalCount
                edges {
                    node {
                        price
                        quantity
                        id
                        product {
                            id
                            photo
                            name
                        }
                    }
                }
            }
        }
    }
`;

export const FLOORS_QUERY = gql`
query MyQuery($after: String, $first: Int, $offset: Int, $name: String, $search: String, $isActive: Boolean, $orderBy: String ) {
  floors(
    after: $after
    first: $first
    offset: $offset
    name: $name
    search: $search
    isActive: $isActive
    orderBy: $orderBy
  ) {
    totalCount
    edges {
      node {
        name
        id
        createdAt
        floorTables {
          totalCount
        }
        isActive
      }
    }
  }
}
`
export const FLOOR_QUERY = gql`
query MyQuery($id: ID!) {
  floor(id: $id) {
    name
    isActive
    id
  }
}
`

export const FLOOR_TABLES_QUERY = gql`
query MyQuery($first: Int, $floor: Decimal, $name: String, $offset: Int, $orderBy: String, $search: String, $isActive: Boolean, $isBooked: Boolean ) {
  floorTables(
    first: $first
    floor: $floor
    name: $name
    offset: $offset
    orderBy: $orderBy
    search: $search
    isActive: $isActive
    isBooked: $isBooked
  ) {
    totalCount
    edges {
      node {
        createdAt
        id
        name
        isActive
        isBooked
        floor {
          id
          name
        }
      }
    }
  }
} 
`

export const FLOOR_TABLE_QUERY = gql`
query MyQuery($id: ID!) {
  floorTable(id: $id) {
    id
    isActive
    name
    floor {
      id
      name
    }
  }
}
`

export const ADDRESS_QUERY = gql`
query MyQuery($id: ID, $user: ID, $addressType: String!) {
  address(id: $id, user: $user, addressType: $addressType) {
    id
    user {
      id
      name
      email
      phone
    }
    street
    state
    house
    createdAt
    country
    city
    area
    address
    addressType
    default
    buildins {
      edges {
        node {
          floor
          id
          latitude
          longitude
          name
          photo
        }
      }
    }
  }
}
`

export const PAYMENT_QUERY = gql`
query MyQuery($id: ID, $order: ID) {
  payment(id: $id, order: $order) {
    amount
    createdAt
    id
    paymentMethod
    order {
      amount
      type
      status
      id
      discountApplied
      createdAt
      finalAmount
      updatedAt
      orderId
    }
    remarks
    status
    trxId
  }
}
  
  `
export const PAYMENTS_QUERY = gql`
    query MyQuery(
        $order: ID
        $amount: Decimal
        $trxId: String
        $first: Int
        $createdAt: DateTime
        $orderBy: String
        $status: ProductPaymentStatusChoices
        $paymentMethod: ProductPaymentPaymentMethodChoices
        $offset: Int
        $search: String = ""
    ) {
        payments(
            order: $order
            amount: $amount
            trxId: $trxId
            first: $first
            createdAt: $createdAt
            orderBy: $orderBy
            status: $status
            paymentMethod: $paymentMethod
            offset: $offset
            search: $search
        ) {
            totalCount
            edges {
                node {
                    amount
                    createdAt
                    id
                    paymentMethod
                    status
                    trxId
                    updatedAt
                    order {
                        id
                        status
                        user {
                            id
                            email
                            name
                            phone
                        }
                    }
                }
            }
        }
    }
`;
export const ADDRESS_PAYMENT_QUERY = gql`
query PAYMENT_QUERY($user:ID, $orderId:ID!){
   address( user: $user) {
    id
    user {
      id
      name
      email
    }
    street
    state
    house
    createdAt
    country
    city
    area
    address
  }
    order(id: $orderId) {
    user {
      id
      name
      email
    }
    address {
      city
      state
      street
      zipCode
      id
    }
    status
    finalAmount
    type
    id
    outlet {
      email
      id
      address
      name
      phone
      manager {
        email
        id
        name
      }
    }
    items {
      totalCount
      edges {
        node {
          price
          quantity
          id
          product {
            id
            images
            name
          }
        }
      }
    }
  }
}
`

export const BUILDING_QUERY = gql`
query MyQuery($id: ID , $address: ID) {
  building(id: $id, address: $address) {
    createdAt
    floor
    id
    latitude
    longitude
    name
    photo
    updatedAt
  }
}
`
export const ATTRIBUTE_QUERY = gql`
    query MyQuery($id: ID!) {
        attribute(id: $id) {
            createdAt
            id
            name
            product {
                id
                name
            }
            attributeOptions {
                totalCount
                edges {
                    node {
                        photo
                        option
                        message
                        id
                        extraPrice
                    }
                }
            }
        }
    }
`;

export const ATTRIBUTES_QUERY = gql`
    query MyQuery($product: String, $last: Int, $offset: Int) {
        attributes(product: $product, last: $last, offset: $offset) {
            totalCount
            edges {
                node {
                    name
                    id
                    createdAt
                    attributeOptions {
                        totalCount
                    }
                    product {
                        name
                        id
                    }
                }
            }
        }
    }
`;

export const DESCRIPTIONS_QUERY = gql`
    query MyQuery($first: Int, $offset: Int, $product: Decimal) {
        productDescriptions(first: $first, offset: $offset, product: $product) {
            totalCount
            edges {
                node {
                    description
                    id
                    label
                    tag
                    product {
                        id
                        name
                    }
                }
            }
        }
    }
`;

export const DESCRIPTION_QUERY = gql`
    query MyQuery($id: ID!) {
        productDescription(id: $id) {
            description
            id
            label
            tag
            product {
                id
                name
            }
        }
    }
`;