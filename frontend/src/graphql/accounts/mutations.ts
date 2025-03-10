import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password:String! ) {
    loginUser(email: $email, password: $password) {
        token
        success
        message
        user{
            id
            name
            email
            role {
              id
              name
            }
        }
    }
}
`;

export const USER_REGISTER = gql`
    mutation MyMutation(
        $email: String!
        $name: String!
        $password: String!
        $phone: String
        $whatsApp: String!
    ) {
        registerUser(
            email: $email
            name: $name
            password: $password
            phone: $phone
            whatsApp: $whatsApp
        ) {
            message
            success
            id
        }
    }
`;



export const PASSWORD_RESET_MAIL_MUTATION = gql`
  mutation MyMutation($email: String!) {
    passwordResetMail(email: $email) {
      message
      success
    }
  }
`

export const RESET_PASSWORD_MUTATION = gql`
mutation MyMutation($otp: String!, $email: String!, $password: String!) {
  passwordReset(email: $email, otp: $otp, password: $password) {
    message
    success
  }
}
`
export const ADDRESS_MUTATION = gql`
  mutation MyMutation($address: String, $area: String, $city: String, $country: String, $house: String, $id: String, $state: String, $street: String, $user: ID, $zipCode: String) {
    addressCud(
      input: {address: $address, area: $area, city: $city, country: $country, house: $house, id: $id, state: $state, street: $street, user: $user, zipCode: $zipCode}
    ) {
      success
    }
  }
`

export const PROFILE_UPDATE_MUTATION = gql`
    mutation MyMutation(
        $dateOfBirth: Date
        $gender: String
        $id: String
        $name: String
        $phone: String
        $photo: String
        $address: String
        $whatsApp: String!
    ) {
        profileUpdate(
            input: {
                dateOfBirth: $dateOfBirth
                gender: $gender
                id: $id
                name: $name
                phone: $phone
                photo: $photo
                address: $address
                isActive: true
                whatsApp: $whatsApp
            }
        ) {
            message
            success
        }
    }
`;

export const OTP_VARIFICATION = gql`
    mutation MyMutation($email: String!, $otp: String!) {
        otpVerify(email: $email, otp: $otp) {
            message
            success
        }
    }
`;