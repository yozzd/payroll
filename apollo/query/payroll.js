import gql from 'graphql-tag';

export const PayrollAll = gql`
  query payrollAll($year: Int!) {
    payrollAll(year: $year) {
      _id
      year
      period
    }
  }
`;

export const PayrollPeriod = gql`
  query payrollPeriod($id: String!) {
    payrollPeriod(id: $id) {
      period
      year
    }
  }
`;

export const PayrollEmployment = gql`
  query payrollEmployment($id: String!) {
    payrollEmployment(id: $id) {
      _id
      employee {
        _id
        d0
        e0
        h0
        i0
        k0
        u0
        v0
        w0
        x0
        y0
      }
    }
  }
`;

export const PayrollSocial = gql`
  query payrollSocial($id: String!) {
    payrollSocial(id: $id) {
      _id
      employee {
        _id
        d0
        e0
        p0
        q0
        r0
        s0
        t0
        z0
        aa0
      }
    }
  }
`;

export const PayrollOvertime = gql`
  query payrollOvertime($id: String!) {
      payrollOvertime(id: $id) {
      _id
      employee {
        _id
        d0
        e0
        ab0
        ac0
        ad0
        ae0
        af0
        ag0
        ah0
        ai0
      }
      total {
        sab0
        sac0
        sad0
        sae0
        saf0
        sag0
        sah0
        sai0
      }
    }
  }
`;

export const PayrollFixedAllowance = gql`
  query payrollFixedAllowance($id: String!) {
    payrollFixedAllowance(id: $id) {
      _id
      employee {
        _id
        d0
        e0
        aj0
        ak0
        al0
        am0
        an0
        ao0
        ap0
        aq0
        ar0
        as0
        at0
        au0
        av0
        aw0
        ax0
      }
      total {
        saj0
        sak0
        sal0
        sam0
        san0
        sao0
        sap0
        saq0
        sar0
        sas0
        sat0
        sau0
        sav0
        saw0
        sax0
      }
    }
  }
`;
