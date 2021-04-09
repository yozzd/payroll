import gql from 'graphql-tag';

export const PphReport = gql`
  query pphReport($id: String!) {
    pphReport(id: $id) {
      _id
      period
      year
      employee {
        _id
        d0
        e0
        ex0
        pph {
          name
          dir
          check
        }
      }
    }
  }
`;

export const faker = '';
