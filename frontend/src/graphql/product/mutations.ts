import { gql } from "@apollo/client";

export const PRODUCT_MUTATION = gql`
 mutation MyMutation($category: ID,$isTaxIncluded:Boolean, $clientMutationId: String, $cookingTime: String, $description: String, $id: String, $images: String, $isActive: Boolean, $kitchen: ID, $name: String!, $price: Decimal!, $sku: String!, $subcategory: ID, $tag: String, $video: String, $tax: Float!) {
  productCud(
    input: {price: $price, isTaxIncluded: $isTaxIncluded, tax: $tax, category: $category, clientMutationId: $clientMutationId, cookingTime: $cookingTime, description: $description, id: $id, images: $images, isActive: $isActive, kitchen: $kitchen, name: $name, sku: $sku, subcategory: $subcategory, tag: $tag, video: $video}
  ) {
    message
    product {
      id
      kitchen {
        id
        name
      }
      category {
        id
        name
      }
      images
      isActive
      cookingTime
      createdAt
      description
      name
      price
      sku
      subcategory {
        id
        name
      }
      tag
      tax
      video
    }
  }
}
`;


export const CATEGORY_MUTATION = gql`
mutation MyMutation($name: String! , $isActive: Boolean , $image: String , $id: String, $description: String , $parent: ID ) {
  categoryCud(
    input: {name: $name, isActive: $isActive, image: $image, id: $id, description: $description, parent: $parent}
  ) {
    success
    message
    category {
      name
      id
    }
  }
}
`

export const ORDER_MUTATION = gql`
mutation MyMutation( $status: String!, $type: String!, $user: ID, $address: ID, $id: String, $isCart: Boolean = true, $outlet: ID, $totalPrice: Decimal!, $tableBookings: String ) {
  orderCud(
    input: {type: $type, status: $status,  user: $user, address: $address, id: $id, isCart: $isCart, outlet: $outlet, totalPrice: $totalPrice, tableBookings: $tableBookings}
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
mutation MyMutation($price: Decimal!, $product: ID , $quantity: Int!, $order: ID!, $id: String) {
  orderProductCud(
    input: {quantity: $quantity, price: $price, product: $product, order: $order, id: $id}
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
mutation MyMutation($amount: Decimal! , $id: String , $order: ID!, $paymentMethod: String!, $remarks: String , $status: String! , $trxId: String!) {
  paymentCud(
    input: {order: $order, amount: $amount, paymentMethod: $paymentMethod, status: $status, id: $id, remarks: $remarks, trxId: $trxId}
  ) {
    success
  }
}
`

export const ADDRES_MUTATION = gql`
mutation MyMutation($address: String, $area: String , $city: String!, $country: String, $house: String, $id: String, $state: String, $street: String, $user: ID!, $zipCode: String) {
  addressCud(
    input: {address: $address, area: $area, city: $city, country: $country, house: $house, id: $id, state: $state, street: $street, user: $user, zipCode: $zipCode}
  ) {
    id
    success
  }
}
`
export const REVIEW_MUTATION = gql`
mutation MyMutation($content: String!, $rating: Int !, $user: ID!, $product: ID!) {
  reviewCud(
    input: {product: $product, user: $user, content: $content, rating: $rating}
  ) {
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

export const CREATE_ORDER_MUTATION = gql`
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    success
  }
}
`