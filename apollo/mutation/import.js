import gql from 'graphql-tag';

export const ImportPayroll = gql`
  mutation importPayroll($input: ImportInputType) {
    importPayroll(input: $input) {
      _id
      year
      month
      period
      dir
      checkPayroll
    }
  }
`;

export const ImportESlip = gql`
  mutation importESlip($input: ImportInputType) {
    importESlip(input: $input) {
      _id
      year
      period
    }
  }
`;

export const ImportThr = gql`
  mutation importThr($input: ImportInputType) {
    importThr(input: $input) {
      _id
      year
      period
    }
  }
`;
