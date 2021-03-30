import gql from 'graphql-tag';

export const ProrateDelete = gql`
  mutation prorateDelete($id: String!) {
    prorateDelete(id: $id) {
      _id
    }
  }
`;

export const GenerateProrate = gql`
  mutation generateProrate($id: String!, $eId: String!) {
    generateProrate(id: $id, eId: $eId) {
      sStatus
    }
  }
`;

export const SendProrate = gql`
  mutation sendProrate($id: String!, $eId: String!) {
    sendProrate(id: $id, eId: $eId) {
      accepted
      rejected
    }
  }
`;
