import gql from 'graphql-tag';

const journalFragment = {
  fragments: {
    journal: gql`
      fragment journal on EmployeeType {
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

const journalBalanceFragment = {
  fragments: {
    balance: gql`
      fragment balance on JournalEmpType {
        category
        salary
        retro
        ot
        accident
        death
        medical
        pension
        posfunc
        housing
        transport
        incentive
        meals
        living
        communication
        other
        thr
        taxReturn
        dtp
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

export const JournalBalance = gql`
  query journalBalance($id: String!) {
    journalBalance(id: $id) {
      _id
      production {
        ...balance
      }
      administration {
        ...balance
      }
      totMandiri
      totFinalPay
      totExpat
      totRetroPay
      totTool
      totCanteen
      totLoan
      totKopkar
      totKer
      totKes
      totTax
      totProduction
      totAdministration
      tot1
      tot2
      tot3
      pensionProd
      pensionAdm
      totPension
      totGross
      totJurnal
      totSelisih
    }
  }
  ${journalBalanceFragment.fragments.balance}
`;
