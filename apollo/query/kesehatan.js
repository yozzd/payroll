import gql from 'graphql-tag';

export const KesehatanReport = gql`
  query kesehatanReport($id: String!) {
    kesehatanReport(id: $id) {
      _id
      period
      year
      dir
      employee {
        _id
        d0
        e0
        o0
        z0
        aa0
        co0
        cq0
        cr0
        cs0
        ct0
        cu0
        ex0
      }
    }
  }
`;

export const faker = '';
