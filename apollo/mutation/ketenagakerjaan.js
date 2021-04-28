import gql from 'graphql-tag';

export const GenPDFKtg = gql`
  mutation genPDFKtg($id: String!) {
    genPDFKtg(id: $id) {
      sStatus
    }
  }
`;

export const GenXLSKtg = gql`
  mutation genXLSKtg($id: String!) {
    genXLSKtg(id: $id) {
      sStatus
    }
  }
`;
