import { gql } from "@apollo/client";


export const SETTING_QUERY = gql`
    query MyQuery($id: ID!) {
        websiteinfo(id: $id) {
            email
            facebook
            id
            instagram
            linkedin
            location
            phone
            x
            whatsappLink
        }
    }
`;
