import gql from 'graphql-tag';

export const SummaryBasic = gql`
  query summaryBasic($id: Int!) {
    summaryBasic(id: $id) {
      employee {
        _id
        d0
        e0
        i0
        u0
        y0
        jan
        feb
        mar
        apr
        mei
        jun
        jul
        agu
        sep
        okt
        nov
        des
        totM
      }
    }
  }
`;

export const faker = '';
