import { gql } from "@apollo/client";

export const SLIDER_MUTATION = gql`
  mutation MyMutation($image: String!, $link: String, $id: String) {
    sliderCud(input: {image: $image, link: $link, id: $id}) {
      message
      success
    }
  }
`;

