import gql from 'graphql-tag';

export const TaxReport = gql`
  query taxReport($id: String!) {
    taxReport(id: $id) {
      _id
      employee {
        _id
        d0
        e0
        i0
        l0
        q0
        u0
        y0
        ai0
        bk0
        bu0
        cn0
        cy0
        cz0
        da0
        db0
        df0
        en0
        eq0
        er0
        es0
				gross
        ttax
      }
    }
  }
`;

export const JournalAdministration = gql`
  query journalAdministration($id: String!) {
    journalAdministration(id: $id) {
      _id
    }
  }
`;
