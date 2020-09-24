import gql from 'graphql-tag';

export default gql`
  mutation importESlip($input: ImportInputType) {
    importESlip(input: $input) {
      _id
      year
      period
    }
  }
`;
