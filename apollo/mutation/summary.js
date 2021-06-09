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

export const GenPDFSummaryOAllow = gql`
  mutation genPDFSummaryOAllow($id: Int!) {
    genPDFSummaryOAllow(id: $id) {
      sStatus
    }
  }
`;

export const GenXLSSummaryOAllow = gql`
  mutation genXLSSummaryOAllow($id: Int!) {
    genXLSSummaryOAllow(id: $id) {
      sStatus
    }
  }
`;

export const GenPDFSummaryPesangon = gql`
  mutation genPDFSummaryPesangon($id: Int!) {
    genPDFSummaryPesangon(id: $id) {
      sStatus
    }
  }
`;

export const GenXLSSummaryPesangon = gql`
  mutation genXLSSummaryPesangon($id: Int!) {
    genXLSSummaryPesangon(id: $id) {
      sStatus
    }
  }
`;

export const GenPDFSummaryThr = gql`
  mutation genPDFSummaryThr($id: Int!) {
    genPDFSummaryThr(id: $id) {
      sStatus
    }
  }
`;

export const GenXLSSummaryThr = gql`
  mutation genXLSSummaryThr($id: Int!) {
    genXLSSummaryThr(id: $id) {
      sStatus
    }
  }
`;
