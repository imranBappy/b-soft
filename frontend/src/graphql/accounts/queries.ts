

import { gql } from "@apollo/client";

export const ME_QUERY = gql`
    query {
        me {
            id
            email
            name
            phone
            address
            role {
                id
                name
            }
            photo
            country
            whatsApp
        }
    }
`;

export const USERS_QUERY = gql`query MyQuery($role: Decimal, $search: String, $offset: Int, $gender: String, $createdAt: DateTime, $createdAtStart: Date, $createdAtEnd: Date, $isActive: Boolean = true, $orderBy: String, $first: Int ) {
  users(
    role: $role
    search: $search
    offset: $offset
    gender: $gender
    createdAt: $createdAt
    createdAtStart: $createdAtStart
    createdAtEnd: $createdAtEnd
    isActive: $isActive
    orderBy: $orderBy
    first: $first
  ) {
    totalCount
    edges {
      node {
        id
        email
        createdAt
        gender
        isActive
        isVerified
        name
        photo
        privacyPolicyAccepted
        role {
          id
          name
        }
        termAndConditionAccepted
        phone
      }
    }
  }
}`

export const USER_QUERY = gql`
query MyQuery($email: String, $id: ID , $phone: String ) {
  user(email: $email, id: $id, phone: $phone) {
    createdAt
    email
    gender
    id
    isActive
    isVerified
    name
    phone
    photo
    dateOfBirth
    role{
       id
      name
    }
    address {
      totalCount
      edges {
        cursor
        node {
          address
          area
          city
          country
          zipCode
          street
          state
          id
          house
          createdAt
        }
      }
    }
  }
}
`

export const PAYMENTS_QUERY = gql`
query MyQuery($order: ID, $amount: Decimal, $trxId: String, $first: Int, $createdAt: DateTime, $orderBy: String, $status: ProductPaymentStatusChoices, $paymentMethod: ProductPaymentPaymentMethodChoices, $offset: Int, $search: String = "") {
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
        remarks
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
`

export const ROLES_QUERY = gql`
  query MyQuery {
    roles {
      id
      name
    }
  }
`

export const ADDRESS_QUERY = gql`
query MyQuery($id: ID, $user: ID) {
  address(id: $id, user: $user) {
    area
    city
    country
    house
    id
    state
    street
    zipCode
    address
    updatedAt
    createdAt

  }
}
`