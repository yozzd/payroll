import gql from 'graphql-tag';

export const PayrollDelete = gql`
  mutation payrollDelete($id: String!) {
    payrollDelete(id: $id) {
      _id
    }
  }
`;

export const GenerateSlip = gql`
  mutation generateSlip($id: String!, $eId: String!, $payPass: Boolean!) {
    generateSlip(id: $id, eId: $eId, payPass: $payPass) {
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

export const GenPayrollXLSNoFin = gql`
  mutation genPayrollXLSNoFin($id: String!) {
    genPayrollXLSNoFin(id: $id) {
      sStatus
    }
  }
`;

export const GenPayrollXLSMaster = gql`
  mutation genPayrollXLSMaster($id: String!) {
    genPayrollXLSMaster(id: $id) {
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
        et0
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
        j0
        l0
        ay0
        ex0
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
        aj0r
        ak0
        ak0r
        al0
        al0r
        am0
        am0r
        an0
        an0r
        ao0
        ao0r
        ap0
        ap0r
        aq0
        aq0r
        ar0
        ar0r
        as0
        as0r
        at0
        at0r
        au0
        au0r
        av0
        av0r
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
        ba0r
        bb0
        bb0r
        bc0
        bc0r
        bd0
        bd0r
        be0
        be0r
        bf0
        bf0r
        bg0
        bg0r
        bh0
        bh0r
        bi0
        bi0r
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

export const EditFee = gql`
  mutation editFee($input: EditFeeInputType) {
    editFee(input: $input) {
      _id
      employee {
        _id
        d0
        e0
        ck0
        ct0
        co0
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
        fa0
        fb0
        fj0
        fl0
        al0f
        al0p
        am0f
        am0p
        as0f
        as0p
        at0f
        at0p
        au0f
        au0p
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
        ex0
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
      employee {
        u0
        v0
      }
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
        g0
        h0
        i0
        j0
        k0
        y0
        ab0
        ad0
        af0
        bv0
        bw0
        by0
        cw0
        dh0
        di0
        dk0
        dl0
        dm0
        dn0
        ds0
        fe0
        fDate
        aj0r
        ak0r
        al0r
        am0r
        an0r
        ao0r
        ap0r
        aq0r
        ar0r
        as0r
        at0r
        au0r
        av0r
        ba0r
        bb0r
        bc0r
        bd0r
        be0r
        bf0r
        bg0r
        bh0r
        bi0r
        final {
          name
          dir
          check
        }
      }
    }
  }
`;

export const HariRaya = gql`
  mutation hariRaya($id: String, $typeHR: Int, $tglHR: String) {
    hariRaya(id: $id, typeHR: $typeHR, tglHR: $tglHR) {
      _id
      year
      month
      period
      dir
      freeze
      typeHR
      tglHR
      employee {
        u0
        v0
      }
    }
  }
`;

export const EditSpAllow = gql`
  mutation editSpAllow($input: EditSpAllowInputType) {
    editSpAllow(input: $input) {
      _id
      dir
      freeze
      employee {
        _id
        d0
        e0
        u0
        fl0
        al0
        al0r
        al0p
        am0
        am0r
        am0p
        as0
        as0r
        as0p
        at0
        at0r
        at0p
        au0
        au0r
        au0p
        spAllowRem
      }
    }
  }
`;

export const GenPDFSpAllow = gql`
  mutation genPDFSpAllow($id: String!) {
    genPDFSpAllow(id: $id) {
      sStatus
    }
  }
`;

export const GenPDFThr = gql`
  mutation genPDFThr($id: String!) {
    genPDFThr(id: $id) {
      sStatus
    }
  }
`;

export const GenXLSThr = gql`
  mutation genXLSThr($id: String!) {
    genXLSThr(id: $id) {
      sStatus
    }
  }
`;

export const GenThrSlip = gql`
  mutation genThrSlip($id: String!, $eId: String!) {
    genThrSlip(id: $id, eId: $eId) {
      sStatus
    }
  }
`;

export const SendThrSlip = gql`
  mutation sendThrSlip($id: String!, $eId: String!) {
    sendThrSlip(id: $id, eId: $eId) {
      accepted
      rejected
    }
  }
`;
