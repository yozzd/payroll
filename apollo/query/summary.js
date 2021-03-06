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

export const SummaryOIncome = gql`
  query summaryOIncome($id: Int!) {
    summaryOIncome(id: $id) {
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
        tOIncome
      }
    }
  }
`;

export const SummaryAbsent = gql`
  query summaryAbsent($id: Int!) {
    summaryAbsent(id: $id) {
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
        tAbsent
      }
    }
  }
`;

export const SummaryODeduction = gql`
  query summaryODeduction($id: Int!) {
    summaryODeduction(id: $id) {
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
        tODeduction
      }
    }
  }
`;

export const SummaryICo = gql`
  query summaryICo($id: Int!) {
    summaryICo(id: $id) {
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
        tICo
      }
    }
  }
`;

export const SummaryIEmp = gql`
  query summaryIEmp($id: Int!) {
    summaryIEmp(id: $id) {
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
        tIEmp
      }
    }
  }
`;

export const SummaryTax = gql`
  query summaryTax($id: Int!) {
    summaryTax(id: $id) {
      employee {
        _id
        d0
        e0
        i0
        u0
        y0
        jan1
        feb1
        mar1
        apr1
        mei1
        jun1
        jul1
        agu1
        sep1
        okt1
        nov1
        des1
        jan2
        feb2
        mar2
        apr2
        mei2
        jun2
        jul2
        agu2
        sep2
        okt2
        nov2
        des2
        tTax
      }
    }
  }
`;

export const SummaryAll = gql`
  query summaryAll($id: Int!) {
    summaryAll(id: $id) {
      employee {
        _id
        d0
        e0
        i0
        u0
        y0
        tBasic
        tOT
        tAllow
        tOAllow
        tPesangon
        tThr
        tOIncome
        tAbsent
        tODeduction
        tICo
        tIEmp
        tTax
      }
    }
  }
`;
