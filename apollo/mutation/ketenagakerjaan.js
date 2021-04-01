import gql from 'graphql-tag';

export const GenPDFKtg = gql`
  mutation genPDFKtg($id: String!) {
    genPDFKtg(id: $id) {
      sStatus
    }
  }
`;

export const faker = '';
