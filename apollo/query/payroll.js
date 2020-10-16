import gql from 'graphql-tag';

export const PayrollAll = gql`
  query payrollAll($year: Int!) {
    payrollAll(year: $year) {
      _id
      year
      period
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

export const PayrollSocial = gql`
  query payrollSocial($id: String!) {
    payrollSocial(id: $id) {
      _id
      employee {
        _id
        d0
        e0
        p0
        q0
        r0
        s0
        t0
        z0
        aa0
        ex0
      }
    }
  }
`;

export const PayrollOvertime = gql`
  query payrollOvertime($id: String!) {
      payrollOvertime(id: $id) {
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
        ex0
      }
    }
  }
`;

export const PayrollFixedAllowance = gql`
  query payrollFixedAllowance($id: String!) {
    payrollFixedAllowance(id: $id) {
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
        ex0
      }
    }
  }
`;

export const PayrollNonFixedAllowance = gql`
  query payrollNonFixedAllowance($id: String!) {
    payrollNonFixedAllowance(id: $id) {
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
        ex0
      }
    }
  }
`;

export const PayrollRetroFill = gql`
  query payrollRetroFill($id: String!) {
    payrollRetroFill(id: $id) {
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
        ex0
      }
      total {
        sbl0
        sbm0
        sbn0
        sbo0
        sbp0
        sbq0
        sbr0
        sbs0
        sbt0
        sbu0
      }
    }
  }
`;

export const PayrollEarningOthers = gql`
  query payrollEarningOthers($id: String!) {
    payrollEarningOthers(id: $id) {
      _id
      employee {
        _id
        d0
        e0
        bv0
        bw0
        bx0
        by0
        bz0
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
      total {
        sbv0
        sbw0
        sbx0
        sby0
        sbz0
        sdr0
        sds0
        sdt0
        sdu0
        sdv0
        sdw0
        sdx0
        sdy0
      }
    }
  }
`;

export const PayrollAbsent = gql`
  query payrollAbsent($id: String!) {
    payrollAbsent(id: $id) {
      _id
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
        cq0
        cr0
        ex0
      }
      total {
        scb0
        scc0
        scd0
        sce0
        sci0
        scj0
        scq0
        scr0
      }
    }
  }
`;

export const PayrollTax = gql`
  query payrollTax($id: String!) {
    payrollTax(id: $id) {
      _id
      employee {
        _id
        d0
        e0
        cz0
        da0
        db0
        ex0
      }
      total {
        scz0
        sda0
        sdb0
      }
    }
  }
`;

export const PayrollReduction = gql`
  query payrollReduction($id: String!) {
    payrollReduction(id: $id) {
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
        ex0
      }
      total {
        sdc0
        sdd0
        sde0
        sdg0
        sdh0
        sdi0
        sdj0
      }
    }
  }
`;

export const PayrollDeductionOthers = gql`
  query payrollDeductionOthers($id: String!) {
    payrollDeductionOthers(id: $id) {
      _id
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
      total {
        sdk0
        sdl0
        sdm0
        sdn0
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
      total {
        sca0
        sdo0
        sdp0
        seb0
        sec0
        sed0
      }
    }
  }
`;
