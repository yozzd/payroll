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

export const EmployeeESlip = gql`
  query employeeESlip($id: String!) {
    employeeESlip(id: $id) {
      _id
      period
      year
      employee {
        _id
        b0
        c0
        h0
        slipPath
      }
    }
  }
`;
