import gql from 'graphql-tag';

export const PayrollDelete = gql`
  mutation payrollDelete($id: String!) {
    payrollDelete(id: $id) {
      _id
    }
  }
`;

export const GenerateESlip = gql`
  mutation generateESlip($id: String!, $eId: String!) {
    generateESlip(id: $id, eId: $eId) {
      sStatus
      slipPath
    }
  }
`;
