import gql from 'graphql-tag';

export const GenPph = gql`
  mutation genPph($id: String!, $eId: String!) {
    genPph(id: $id, eId: $eId) {
      sStatus
    }
  }
`;

export const faker = '';
