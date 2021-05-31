import gql from 'graphql-tag';

export const GenPDFPercentage = gql`
  mutation genPDFPercentage($id: String!) {
    genPDFPercentage(id: $id) {
      sStatus
    }
  }
`;

export const GenXLSPercentage = gql`
  mutation genXLSPercentage($id: String!) {
    genXLSPercentage(id: $id) {
      sStatus
    }
  }
`;
