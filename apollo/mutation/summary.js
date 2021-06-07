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

export const GenPDFSummaryOT = gql`
  mutation genPDFSummaryOT($id: Int!) {
    genPDFSummaryOT(id: $id) {
      sStatus
    }
  }
`;

export const GenXLSSummaryOT = gql`
  mutation genXLSSummaryOT($id: Int!) {
    genXLSSummaryOT(id: $id) {
      sStatus
    }
  }
`;

export const GenPDFSummaryAllow = gql`
  mutation genPDFSummaryAllow($id: Int!) {
    genPDFSummaryAllow(id: $id) {
      sStatus
    }
  }
`;

export const GenXLSSummaryAllow = gql`
  mutation genXLSSummaryAllow($id: Int!) {
    genXLSSummaryAllow(id: $id) {
      sStatus
    }
  }
`;
