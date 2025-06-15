import { gql } from '@apollo/client';

export const PRODUCTS_QUERY = gql`
    query PRODUCTS_QUERY(
        $offset: Int
        $search: String
        $after: String
        $before: String
        $first: Int
        $price: Decimal
        $orderBy: String
        $isActive: Boolean
        $name: String
        $priceLte: Decimal
        $tag: String
        $createdAtEnd: Date
        $createdAtStart: Date
        $category: String
        $slug: String
    ) {
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
            slug: $slug
        ) {
            totalCount
            edges {
                node {
                    id
                    slug
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
                    attributes {
                        totalCount
                    }
                }
            }
        }
    }
`;
export const PRODUCT_QUERY = gql`
    query MyQuery($id: ID, $slug: String) {
        product(id: $id, slug: $slug) {
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
            slug
        }
    }
`;

export const CATEGORIES_QUERY = gql`
    query CATEGORIES_QUERY(
        $search: String
        $orderBy: String
        $first: Int
        $isActive: Boolean
        $offset: Int
    ) {
        categories(
            search: $search
            orderBy: $orderBy
            first: $first
            isActive: $isActive
            offset: $offset
        ) {
            totalCount
            edges {
                node {
                    id
                    name
                    image
                    products {
                        totalCount
                    }
                }
            }
        }
    }
`;

export const CATEGORY_QUERY = gql`
    query MyQuery($id: ID!) {
        category(id: $id) {
            id
            description
            image
            isActive
            name
            parent {
                id
                name
            }
        }
    }
`;

export const SUBCATEGORIES_QUERY = gql`
    query SUBCATEGORIES_QUERY(
        $offset: Int
        $first: Int
        $search: String
        $parentId: ID!
    ) {
        subcategories(
            offset: $offset
            first: $first
            search: $search
            parentId: $parentId
        ) {
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
`;

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
                    items {
                        totalCount
                        edges {
                            node {
                                price
                                quantity
                                id
                                product {
                                    id
                                    name
                                    photo
                                }
                                access {
                                    isExpired
                                }
                                createdAt
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
            status
            totalPrice
            id
            createdAt
            orderId
            items {
                totalCount
                edges {
                    node {
                        price
                        quantity
                        id
                        product {
                            id
                            name
                            photo
                        }
                        access {
                            download
                            email
                            id
                            note
                            password
                            username
                            cookies
                            expiredDate
                            isExpired
                            createdAt
                        }
                        orderProductAttribute {
                            totalCount
                            edges {
                                node {
                                    extraPrice
                                    id
                                    attribute {
                                        name
                                        id
                                    }
                                    option {
                                        id
                                        extraPrice
                                        option
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const FLOORS_QUERY = gql`
    query MyQuery(
        $after: String
        $first: Int
        $offset: Int
        $name: String
        $search: String
        $isActive: Boolean
        $orderBy: String
    ) {
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
`;
export const FLOOR_QUERY = gql`
    query MyQuery($id: ID!) {
        floor(id: $id) {
            name
            isActive
            id
        }
    }
`;

export const FLOOR_TABLES_QUERY = gql`
    query MyQuery(
        $first: Int
        $floor: Decimal
        $name: String
        $offset: Int
        $orderBy: String
        $search: String
        $isActive: Boolean
        $isBooked: Boolean
    ) {
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
`;

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
`;

export const ADDRESS_QUERY = gql`
    query MyQuery($id: ID, $user: ID) {
        address(id: $id, user: $user) {
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
        }
    }
`;

export const PAYMENT_QUERY = gql`
    query MyQuery($id: ID, $order: ID) {
        payment(id: $id, order: $order) {
            amount
            createdAt
            id
            paymentMethod
            remarks
            status
            trxId
        }
    }
`;

export const ADDRESS_PAYMENT_QUERY = gql`
    query PAYMENT_QUERY($user: ID, $orderId: ID!) {
        address(user: $user) {
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
            totalPrice
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
`;

export const PRODUCT_DESCRIPTIONS_QUERY = gql`
    query MyQuery(
        $offset: Int
        $first: Int
        $orderBy: String
        $product: Decimal
        $tag: Decimal
    ) {
        productDescriptions(
            offset: $offset
            first: $first
            orderBy: $orderBy
            product: $product
            tag: $tag
        ) {
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
export const PRODUCT_DESCRIPTION_QUERY = gql`
    query MyQuery($id: ID!) {
        productDescription(id: $id) {
            description
            id
            tag
            label
            product {
                id
                name
            }
        }
    }
`;
export const PRODUCT_REVIEW = gql`
    query MyQuery($first: Int, $offset: Int, $product: String!) {
        reviews(first: $first, offset: $offset, product: $product) {
            totalCount
            edges {
                node {
                    content
                    createdAt
                    id
                    rating
                    user {
                        id
                        name
                    }
                }
            }
        }
    }
`;

export const SOFTWARES_QUERY = gql`
    query MyQuery($first: Int = 10, $offset: Int = 10) {
        softwares(first: $first, offset: $offset) {
            totalCount
            edges {
                node {
                    buyLink
                    downloadLink
                    id
                    name
                    officialSite
                    tutorialLink
                }
            }
        }
    }
`;
