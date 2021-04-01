import gql from 'graphql-tag';

export const GenPDFTrf = gql`
  mutation genPDFTrf($id: String!) {
    genPDFTrf(id: $id) {
      sStatus
    }
  }
`;

export const GenXLSTrf = gql`
  mutation genXLSTrf($id: String!) {
    genXLSTrf(id: $id) {
      sStatus
    }
  }
`;
