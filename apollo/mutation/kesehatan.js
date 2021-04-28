import gql from 'graphql-tag';

export const GenPDFKes = gql`
  mutation genPDFKes($id: String!) {
    genPDFKes(id: $id) {
      sStatus
    }
  }
`;

export const GenXLSKes = gql`
  mutation genXLSKes($id: String!) {
    genXLSKes(id: $id) {
      sStatus
    }
  }
`;
