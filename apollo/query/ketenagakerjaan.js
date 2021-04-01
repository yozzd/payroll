import gql from 'graphql-tag';

export const KetenagakerjaanReport = gql`
  query ketenagakerjaanReport($id: String!) {
    ketenagakerjaanReport(id: $id) {
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
        ay0
        cb0
        cc0
        cd0
        ce0
        ci0
        cj0
        cm0
        ck0
      }
    }
  }
`;

export const faker = '';
