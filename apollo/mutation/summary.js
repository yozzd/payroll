import gql from 'graphql-tag';

export const GenPDFSummaryBasic = gql`
  mutation genPDFSummaryBasic($id: Int!) {
    genPDFSummaryBasic(id: $id) {
      sStatus
    }
  }
`;

export const GenXLSSummaryBasic = gql`
  mutation genXLSSummaryBasic($id: Int!) {
    genXLSSummaryBasic(id: $id) {
      sStatus
    }
  }
`;
