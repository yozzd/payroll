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

export const GeneratePayrollXLS = gql`
  mutation generatePayrollXLS($id: String!) {
    generatePayrollXLS(id: $id) {
      sStatus
    }
  }
`;

export const GenerateAccCheck = gql`
  mutation generateAccCheck($id: String!) {
    generateAccCheck(id: $id) {
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

export const EditBasic = gql`
  mutation editBasic($input: EditBasicInputType) {
    editBasic(input: $input) {
      _id
      employee {
        _id
        d0
        e0
        g0
        ay0
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

export const EditEarningOthers = gql`
  mutation editEarningOthers($input: EditEarningOthersInputType) {
    editEarningOthers(input: $input) {
      _id
      employee {
        _id
        d0
        e0
        bv0
        bw0
        bx0
        dr0
        ds0
        dt0
        du0
        dv0
        dw0
        dx0
        dy0
      }
    }
  }
`;

export const EditAbsent = gql`
  mutation editAbsent($input: EditAbsentInputType) {
    editAbsent(input: $input) {
      _id
      employee {
        _id
        d0
        e0
        cw0
        cx0
      }
    }
  }
`;

export const EditTax = gql`
  mutation editTax($input: EditTaxInputType) {
    editTax(input: $input) {
      _id
      employee {
        _id
        d0
        e0
        dz0
        ea0
      }
    }
  }
`;

export const EditReduction = gql`
  mutation editReduction($input: EditReductionInputType) {
    editReduction(input: $input) {
      _id
      employee {
        _id
        d0
        e0
        dc0
        dd0
        de0
        dg0
        dh0
        di0
        dj0
      }
    }
  }
`;

export const EditDeductionOthers = gql`
  mutation editDeductionOthers($input: EditDeductionOthersInputType) {
    editDeductionOthers(input: $input) {
      _id
      employee {
        _id
        d0
        e0
        dk0
        dl0
        dm0
        dn0
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

export const EditManualEmployee = gql`
  mutation editManualEmployee($input: EditManualEmployeeInputType) {
    editManualEmployee(input: $input) {
      _id
      employee {
        _id
        d0
        e0
        fc0
        fe0
      }
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

export const CloneEmployee = gql`
  mutation cloneEmployee($input: CloneEmployeeInputType) {
    cloneEmployee(input: $input) {
      sStatus
    }
  }
`;

export const ClonePayroll = gql`
  mutation clonePayroll($input: ClonePayrollInputType) {
    clonePayroll(input: $input) {
      _id
      year
      month
      period
      dir
      freeze
    }
  }
`;

export const EmployeeDelete = gql`
  mutation employeeDelete($id: String!, $del: [DeleteInputType]!) {
    employeeDelete(id: $id, del: $del) {
      _id
    }
  }
`;

export const PayrollFreeze = gql`
  mutation payrollFreeze($id: String!, $freeze: Boolean!) {
    payrollFreeze(id: $id, freeze: $freeze) {
      _id
      year
      month
      period
      dir
      freeze
    }
  }
`;

export const GenerateFinal = gql`
  mutation generateFinal($id: String!, $eId: String!) {
    generateFinal(id: $id, eId: $eId) {
      sStatus
    }
  }
`;

export const EditFinalEmployee = gql`
  mutation editFinalEmployee($input: EditFinalEmployeeInputType) {
    editFinalEmployee(input: $input) {
      _id
      employee {
        _id
        d0
        e0
        fDate
        final {
          name
          dir
          check
        }
      }
    }
  }
`;
