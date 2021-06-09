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
        tBasic
      }
    }
  }
`;

export const SummaryOT = gql`
  query summaryOT($id: Int!) {
    summaryOT(id: $id) {
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
        tOT
      }
    }
  }
`;

export const SummaryAllow = gql`
  query summaryAllow($id: Int!) {
    summaryAllow(id: $id) {
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
        tAllow
      }
    }
  }
`;

export const SummaryOAllow = gql`
  query summaryOAllow($id: Int!) {
    summaryOAllow(id: $id) {
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
        tOAllow
      }
    }
  }
`;

export const SummaryPesangon = gql`
  query summaryPesangon($id: Int!) {
    summaryPesangon(id: $id) {
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
        tPesangon
      }
    }
  }
`;

export const SummaryThr = gql`
  query summaryThr($id: Int!) {
    summaryThr(id: $id) {
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
        tThr
      }
    }
  }
`;
