import gql from 'graphql-tag';

const journalFragment = {
  fragments: {
    journal: gql `
    	fragment journal on EmployeeJType {
        _id
        d0
        e0
        l0
        u0
        v0
        w0
        y0
        ai0
        cy0
        df0
    	}
    `,
  },
};

export const JournalCategory = gql`
  query journalCategory($id: String!, $cat1: Boolean!, $cat2: Boolean!) {
    journalCategory(id: $id) {
      _id
      employeeA @include(if: $cat1) {
        ...journal
      }
      employeeP @include(if: $cat2) {
        ...journal
      }
    }
  }
  ${journalFragment.fragments.journal}
`;

export const JournalProduction = gql`
  query journalProduction($id: String!) {
    journalProduction(id: $id) {
      _id
      employee {
        _id
        d0
        e0
        l0
        u0
        v0
        w0
        y0
        cy0
      }
    }
  }
`;
