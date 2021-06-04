import gql from 'graphql-tag';

export const GenPDFSummary = gql`
  mutation genPDFSummary($id: String!) {
    genPDFSummary(id: $id) {
      sStatus
    }
  }
`;

export const GenXLSSummary = gql`
  mutation genXLSSummary($id: String!) {
    genXLSSummary(id: $id) {
      sStatus
    }
  }
`;
