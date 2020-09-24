import gql from 'graphql-tag';

export default gql`
  mutation eslipDelete($id: String!) {
    eslipDelete(id: $id) {
      _id
    }
  }
`;

export const GenerateESlip = gql`
  mutation generateESlip($id: String!, $eId: String!) {
    generateESlip(id: $id, eId: $eId) {
      sStatus
      slipPath
    }
  }
`;

export const SendESlip = gql`
  mutation sendESlip($id: String!, $eId: String!) {
    sendESlip(id: $id, eId: $eId) {
      accepted
      rejected
    }
  }
`;
