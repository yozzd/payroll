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
        bu0
        bv0
        bx0
        cb0
        cc0
        cg0
        cq0
        cs0
        cy0
        df0 
        ef0   
        eg0
        eh0
        ei0
        ej0
        ek0
        el0
        em0
        eo0
        es0
    	}
    `,
  },
};

export const JournalProduction = gql`
  query journalProduction($id: String!) {
    journalProduction(id: $id) {
      _id
      employeeP {
        ...journal
      }
    }
  }
  ${journalFragment.fragments.journal}
`;

export const JournalAdministration = gql`
  query journalAdministration($id: String!) {
    journalAdministration(id: $id) {
      _id
      employeeA {
        ...journal
      }
    }
  }
  ${journalFragment.fragments.journal}
`;
