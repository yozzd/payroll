import gql from 'graphql-tag';

export const PayrollAll = gql`
  query payrollAll($year: Int!) {
    payrollAll(year: $year) {
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

export const PayrollPeriod = gql`
  query payrollPeriod($id: String!) {
    payrollPeriod(id: $id) {
      period
      year
    }
  }
`;

export const PayrollEmployment = gql`
  query payrollEmployment($id: String!) {
    payrollEmployment(id: $id) {
      _id
      freeze
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
        ex0
      }
    }
  }
`;

export const PayrollPrivate = gql`
  query payrollPrivate($id: String!) {
    payrollPrivate(id: $id) {
      _id
      freeze
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
        ex0
      }
    }
  }
`;

export const PayrollBasic = gql`
  query payrollBasic($id: String!) {
      payrollBasic(id: $id) {
      _id
      freeze
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

export const PayrollOvertime = gql`
  query payrollOvertime($id: String!) {
      payrollOvertime(id: $id) {
      _id
      freeze
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
        ex0
      }
    }
  }
`;

export const PayrollFixedAllowance = gql`
  query payrollFixedAllowance($id: String!) {
    payrollFixedAllowance(id: $id) {
      _id
      freeze
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
        ex0
      }
    }
  }
`;

export const PayrollNonFixedAllowance = gql`
  query payrollNonFixedAllowance($id: String!) {
    payrollNonFixedAllowance(id: $id) {
      _id
      freeze
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
        ex0
      }
    }
  }
`;

export const PayrollRetroFill = gql`
  query payrollRetroFill($id: String!) {
    payrollRetroFill(id: $id) {
      _id
      freeze
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
        ex0
      }
    }
  }
`;

export const PayrollLeave = gql`
  query payrollLeave($id: String!) {
    payrollLeave(id: $id) {
      _id
      freeze
      employee {
        _id
        d0
        e0
        by0
        bz0
        ex0
      }
    }
  }
`;

export const PayrollEarningOthers = gql`
  query payrollEarningOthers($id: String!) {
    payrollEarningOthers(id: $id) {
      _id
      freeze
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
        ex0
      }
    }
  }
`;

export const PayrollAbsent = gql`
  query payrollAbsent($id: String!) {
    payrollAbsent(id: $id) {
      _id
      freeze
      employee {
        _id
        d0
        e0
        cw0
        cx0
        ex0
      }
    }
  }
`;

export const PayrollFee = gql`
  query payrollFee($id: String!) {
    payrollFee(id: $id) {
      _id
      freeze
      employee {
        _id
        d0
        e0
        cb0
        cc0
        cd0
        ce0
        ci0
        cj0
        ck0
        cq0
        cr0
        ct0
        co0
        ex0
      }
    }
  }
`;

export const PayrollTax = gql`
  query payrollTax($id: String!) {
    payrollTax(id: $id) {
      _id
      freeze
      employee {
        _id
        d0
        e0
        cz0
        da0
        db0
        dz0
        ea0
        es0
        ex0
      }
    }
  }
`;

export const PayrollReduction = gql`
  query payrollReduction($id: String!) {
    payrollReduction(id: $id) {
      _id
      freeze
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
        ex0
      }
    }
  }
`;

export const PayrollDeductionOthers = gql`
  query payrollDeductionOthers($id: String!) {
    payrollDeductionOthers(id: $id) {
      _id
      freeze
      employee {
        _id
        d0
        e0
        dk0
        dl0
        dm0
        dn0
        ex0
      }
    }
  }
`;

export const PayrollPayment = gql`
  query payrollPayment($id: String!) {
    payrollPayment(id: $id) {
      _id
      employee {
        _id
        d0
        e0
        ca0
        do0
        dp0
        eb0
        ec0
        ed0
        ex0
      }
    }
  }
`;

export const PayrollSlip = gql`
  query payrollSlip($id: String!) {
    payrollSlip(id: $id) {
      _id
      period
      year
      employee {
        _id
        d0
        e0
        ew0
        ex0
        slip {
          name
          dir
          check
        }
      }
    }
  }
`;

export const PayrollFlags = gql`
  query payrollFlags($id: String!) {
    payrollFlags(id: $id) {
      _id
      freeze
      employee {
        _id
        d0
        e0
        ex0
        ey0
        ez0
        fb0
        fj0
        fl0
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

export const PayrollManual = gql`
  query payrollManual($id: String!) {
    payrollManual(id: $id) {
      _id
      freeze
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

export const PayrollFinal = gql`
  query payrollFinal($id: String!) {
    payrollFinal(id: $id) {
      _id
      freeze
      period
      year
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

export const PayrollSpAllow = gql`
  query payrollSpAllow($id: String!) {
    payrollSpAllow(id: $id) {
      _id
      dir
      freeze
      employee {
        _id
        d0
        e0
        u0
        fl0
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
