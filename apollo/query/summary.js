import gql from 'graphql-tag';

export const SummaryBasic = gql`
  query summaryBasic($id: String!) {
    summaryBasic(id: $id) {
      _id
      period
      year
      dir
      employee {
        _id
        d0
        e0
      }
    }
  }
`;

export const faker = '';
