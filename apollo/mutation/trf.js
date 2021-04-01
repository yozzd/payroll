import gql from 'graphql-tag';

export const GenPDFTrf = gql`
  mutation genPDFTrf($id: String!) {
    genPDFTrf(id: $id) {
      sStatus
    }
  }
`;

export const faker = '';
