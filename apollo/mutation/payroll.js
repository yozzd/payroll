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

export const EditPrivate = gql`
  mutation editPrivate($input: EditPrivateInputType) {
    editPrivate(input: $input) {
      _id
      employee {
        _id
        d0
        e0
        n0
        o0
        p0
        q0
        r0
        s0
        t0
        z0
        aa0
        ew0
      }
    }
  }
`;

export const EditOvertime = gql`
  mutation editOvertime($input: EditOvertimeInputType) {
    editOvertime(input: $input) {
      _id
      employee {
        _id
        d0
        e0
        ab0
        ac0
        ad0
        ae0
        af0
        ag0
        ah0
        ai0
      }
    }
  }
`;

export const EditFixedAllowance = gql`
  mutation editFixedAllowance($input: EditFixedAllowanceInputType) {
    editFixedAllowance(input: $input) {
      _id
      employee {
        _id
        d0
        e0
        aj0
        ak0
        al0
        am0
        an0
        ao0
        ap0
        aq0
        ar0
        as0
        at0
        au0
        av0
        aw0
      }
    }
  }
`;

export const EditNonFixedAllowance = gql`
  mutation editNonFixedAllowance($input: EditNonFixedAllowanceInputType) {
    editNonFixedAllowance(input: $input) {
      _id
      employee {
        _id
        d0
        e0
        ba0
        bb0
        bc0
        bd0
        be0
        bf0
        bg0
        bh0
        bi0
        bj0
      }
    }
  }
`;

export const EditRetroFill = gql`
  mutation editRetroFill($input: EditRetroFillInputType) {
    editRetroFill(input: $input) {
      _id
      employee {
        _id
        d0
        e0
        bl0
        bm0
        bn0
        bo0
        bp0
        bq0
        br0
        bs0
        bt0
        bu0
      }
    }
  }
`;

export const EditLeave = gql`
  mutation editLeave($input: EditLeaveInputType) {
    editLeave(input: $input) {
      _id
      employee {
        _id
        d0
        e0
        by0
        bz0
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
