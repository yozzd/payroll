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

export const EditEmployment = gql`
  mutation editEmployment($input: EditEmploymentInputType) {
    editEmployment(input: $input) {
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

export const EditFlagsEmployee = gql`
  mutation editFlagsEmployee($input: EditFlagsEmployeeInputType) {
    editFlagsEmployee(input: $input) {
      _id
      employee {
        _id
        d0
        e0
        ex0
        ey0
        ez0
        fb0
      }
    }
  }
`;
