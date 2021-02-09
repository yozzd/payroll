import gql from 'graphql-tag';

export const PayrollDelete = gql`
  mutation payrollDelete($id: String!) {
    payrollDelete(id: $id) {
      _id
    }
  }
`;

export const GenerateSlip = gql`
  mutation generateSlip($id: String!, $eId: String!) {
    generateSlip(id: $id, eId: $eId) {
      sStatus
    }
  }
`;

export const SendSlip = gql`
  mutation sendSlip($id: String!, $eId: String!) {
    sendSlip(id: $id, eId: $eId) {
      accepted
      rejected
    }
  }
`;

export const GenerateReportPayroll = gql`
  mutation generateReportPayroll($id: String!) {
    generateReportPayroll(id: $id) {
      sStatus
    }
  }
`;

export const AddEmployee = gql`
  mutation addEmployee($input: AddEmployeeInputType) {
    addEmployee(input: $input) {
      sStatus
    }
  }
`;
