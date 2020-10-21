import gql from 'graphql-tag';

export const JournalProduction = gql`
  query journalProduction($id: String!) {
    journalProduction(id: $id) {
      _id
      employee {
        _id
        d0
        e0
        u0
        v0
        y0
      }
    }
  }
`;

export const JournalAdministration= gql`
  query journalAdministration($id: String!) {
    journalAdministration(id: $id) {
      _id
      employee {
        _id
        d0
        e0
        u0
        v0
        y0
      }
    }
  }
`;

