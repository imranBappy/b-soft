import { gql } from "@apollo/client";



export const DASHBOARD_QUERIES = gql`
    query Dashboard {
        users(first: 10, orderBy: "-createdAt") {
            totalCount
            edges {
                node {
                    id
                    photo
                    phone
                    name
                    email
                    createdAt
                }
            }
        }
        orders(first: 10, orderBy: "-createdAt") {
            totalCount
            edges {
                node {
                    id
                    totalPrice
                    status
                    orderId
                    createdAt
                    user {
                        name
                        id
                    }
                    items {
                        totalCount
                    }
                }
            }
        }
        payments(first: 10, orderBy: "-createdAt") {
            totalCount
            edges {
                node {
                    trxId
                    status
                    amount
                    createdAt
                    id
                }
            }
        }
        products(first: 10, orderBy: "-createdAt") {
            totalCount
            edges {
                node {
                    id
                    price
                    name
                    createdAt
                    photo
                    
                    orders {
                        totalCount
                    }
                    category {
                        name
                        id
                    }
                }
            }
        }

     
    
        categories(first: 10, orderBy: "-createdAt") {
            totalCount
        }
    }
`;