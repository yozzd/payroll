import gql from 'graphql-tag';

export const ThrDelete = gql`
  mutation thrDelete($id: String!) {
    thrDelete(id: $id) {
      _id
    }
  }
`;

export const GenerateThr = gql`
  mutation generateThr($id: String!, $eId: String!, $thrPass: Boolean!) {
    generateThr(id: $id, eId: $eId, thrPass: $thrPass) {
      sStatus
    }
  }
`;

export const SendThr = gql`
  mutation sendThr($id: String!, $eId: String!) {
    sendThr(id: $id, eId: $eId) {
      accepted
      rejected
    }
  }
`;
