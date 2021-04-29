import gql from 'graphql-tag';

export const GenXLSJournal = gql`
  mutation genXLSJournal($id: String!) {
    genXLSJournal(id: $id) {
      sStatus
    }
  }
`;

export const fake = '';
