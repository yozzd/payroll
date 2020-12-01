import gql from 'graphql-tag';

export const Thrs = gql`
  query thrs($year: Int!) {
    thrs(year: $year) {
      _id
      year
      period
    }
  }
`;

export const EmployeeThr = gql`
  query employeeThr($id: String!) {
    employeeThr(id: $id) {
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
