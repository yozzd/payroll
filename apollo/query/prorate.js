import gql from 'graphql-tag';

export const Prorate = gql`
  query prorate($year: Int!) {
    prorate(year: $year) {
      _id
      year
      period
    }
  }
`;

export const EmployeeProrate = gql`
  query employeeProrate($id: String!) {
    employeeProrate(id: $id) {
      _id
      period
      year
      employee {
        _id
        b0
        c0
        e0
        slip {
          name
          dir
          check
        }
      }
    }
  }
`;
