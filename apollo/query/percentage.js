import gql from 'graphql-tag';

export const PercentageReport = gql`
  query percentageReport($id: String!) {
    percentageReport(id: $id) {
      _id
      period
      year
      dir
      category {
        department
        upah
        ot
        active
        finalPay
        percentage
      }
    }
  }
`;

export const faker = '';
