import gql from 'graphql-tag';

export const TaxDelete = gql`
  mutation taxDelete($id: String!) {
    taxDelete(id: $id) {
      _id
    }
  }
`;

export const GenerateTax = gql`
  mutation generateTax($id: String!, $eId: String!) {
    generateTax(id: $id, eId: $eId) {
      sStatus
    }
  }
`;

export const SendTax = gql`
  mutation sendTax($id: String!, $eId: String!) {
    sendTax(id: $id, eId: $eId) {
      accepted
      rejected
    }
  }
`;

export const GenPDFTax = gql`
  mutation genPDFTax($id: String!) {
    genPDFTax(id: $id) {
      sStatus
    }
  }
`;

export const GenXLSTax = gql`
  mutation genXLSTax($id: String!) {
    genXLSTax(id: $id) {
      sStatus
    }
  }
`;
