import gql from 'graphql-tag';

export const GenPDFKes = gql`
  mutation genPDFKes($id: String!) {
    genPDFKes(id: $id) {
      sStatus
    }
  }
`;

export const faker = '';
