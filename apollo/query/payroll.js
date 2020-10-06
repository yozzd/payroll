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
      sab0
      sac0
      sad0
      sae0
      saf0
      sag0
      sah0
      sai0
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
    }
  }
`;
