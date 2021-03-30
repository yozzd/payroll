import gql from 'graphql-tag';

export const TrfReport = gql`
  query trfReport($id: String!) {
    trfReport(id: $id) {
      _id
      period
      year
      employee {
        _id
        d0
        e0
        s0
        t0
        ec0
        ec0F
      }
    }
  }
`;

export const Faker = gql`
  query faker ($id: String!) {
    faker(id: $id) {
      _id
    }
  }
`;
