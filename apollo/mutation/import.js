import gql from 'graphql-tag';

export const ImportPayroll = gql`
  mutation importPayroll($input: ImportInputType) {
    importPayroll(input: $input) {
      _id
      year
      period
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
