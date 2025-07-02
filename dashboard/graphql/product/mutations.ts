import { gql } from "@apollo/client";

export const PRODUCT_MUTATION = gql`
    mutation MyMutation(
        $category: ID
        $id: String
        $isActive: Boolean
        $name: String!
        $offerPrice: Decimal
        $photo: String
        $price: Decimal!
        $priceRange: String
        $shortDescription: String
        $tag: String
        $slug: String
    ) {
        productCud(
            input: {
                name: $name
                price: $price
                category: $category
                id: $id
                isActive: $isActive
                offerPrice: $offerPrice
                photo: $photo
                priceRange: $priceRange
                shortDescription: $shortDescription
                tag: $tag
                slug: $slug
            }
        ) {
            success
        }
    }
`;
export const PRODUCT_ACCESS_MUTATION = gql`
mutation MyMutation($accessLimit: Int = 10, $accessCount: Int = 0, $attributeOption: ID, $cookies: String, $download: String, $email: String, $expiredDate: DateTime, $item: ID!, $note: String , $password: String, $prodduct: ID , $username: String) {
  productAccessCud(
    input: {accessCount: $accessCount, accessLimit: $accessLimit, attributeOption: $attributeOption, cookies: $cookies, download: $download, email: $email, expiredDate: $expiredDate, item: $item, note: $note, password: $password, prodduct: $prodduct, username: $username}
  ) {
    success
  }
}
`

export const CATEGORY_MUTATION = gql`
    mutation MyMutation(
        $name: String!
        $isActive: Boolean
        $image: String
        $id: String
        $description: String
    ) {
        categoryCud(
            input: {
                name: $name
                isActive: $isActive
                image: $image
                id: $id
                description: $description
            }
        ) {
            success
            message
            category {
                name
                id
            }
        }
    }
`;

export const ORDER_MUTATION = gql`
mutation MyMutation($status: String!, $type: String!, $user: ID,$id: String, $isCart: Boolean = true, $outlet: ID, $finalAmount: Decimal!, $tableBookings: String, $orderId: String, $amount: Decimal!) {
  orderCud(
    input: {type: $type, status: $status, user: $user,  id: $id, isCart: $isCart, outlet: $outlet, finalAmount: $finalAmount, tableBookings: $tableBookings, orderId: $orderId, amount: $amount}
  ) {
    message
    success
    order {
      id
    }
  }
}
`;

export const ORDER_PRODUCT_MUTATION = gql`
mutation MyMutation($price: Decimal!, $product: ID, $quantity: Int!, $order: ID!, $id: String, $discount: Decimal = 0, $vat: Decimal!) {
  orderProductCud(
    input: {quantity: $quantity, price: $price, product: $product, order: $order, id: $id, discount: $discount, vat: $vat}
  ) {
    success
  }
}
`

export const FLOOR_MUTATION = gql`mutation MyMutation($id: String, $isActive: Boolean = false, $name: String! ) {
  floorCud(input: {id: $id, isActive: $isActive, name: $name}) {
    success
  }
}`

export const FLOOR_TABLE_MUTATION = gql`
  mutation MyMutation($floor: ID!, $id: String, $name: String!, $isActive: Boolean = true) {
  floorTableCud(input: {name: $name, floor: $floor, id: $id, isActive: $isActive}) {
    success
  }
}
`

export const PAYMENT_MUTATION = gql`
mutation MyMutation($amount: Decimal!, $id: String, $order: ID!, $paymentMethod: String!, $remarks: String, $status: String!, $trxId: String!) {
  paymentCud(
    input: {order: $order, amount: $amount, paymentMethod: $paymentMethod, status: $status, id: $id, remarks: $remarks, trxId: $trxId}
  ) {
    success
    message
  }
}
`

export const DELETE_PRODUCT_MUTATION = gql`
mutation MyMutation($id: ID!) {
  deleteProduct(id: $id) {
    message
    success
  }
}
`

export const DELETE_ORDER_PRODUCT = gql`
mutation MyMutation($id: ID!) {
  deleteOrderProduct(id: $id) {
    message
    success
  }
}
`
export const PRODUCT_DESCRIPTION_MUTATION = gql`
mutation MyMutation($id: String ,, $product: ID!, $label: String!, $description: String! , $tag: String!) {
  productDescriptionCud(
    input: {product: $product,  id: $id, description: $description, label: $label, tag: $tag}
  ) {
    success
  }
}
`

export const PRODUCT_ATTRIBUTE_AND_OPTION_MUTATIONI = gql`
    mutation MyMutation($input: ProductAttributeInput!) {
        productAttributeAndOptonCud(input: $input) {
            success
        }
    }
`;

export const DELETE_ATTRIBUTE = gql`
    mutation MyMutation($id: ID!) {
        deleteAttribute(id: $id) {
            message
            success
        }
    }
`;

export const DELETE_DESCRIPTION = gql`
    mutation MyMutation($id: ID!) {
        deleteDescription(id: $id) {
            message
            success
        }
    }
`;