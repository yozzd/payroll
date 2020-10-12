const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const { DateFormat } = require('../scalar/date');
const { IntPre0, FloatPre2, FloatPre4 } = require('../scalar/number');

const EmployeeType = new GraphQLObjectType({
  name: 'EmployeeType',
  fields: () => ({
    _id: { type: GraphQLString },
    d0: { type: GraphQLString },
    e0: { type: GraphQLString },
    g0: { type: GraphQLInt },
    h0: { type: GraphQLString },
    i0: { type: DateFormat },
    j0: { type: GraphQLInt },
    k0: { type: DateFormat },
    l0: { type: IntPre0 },
    m0: { type: GraphQLString },
    n0: { type: GraphQLString },
    o0: { type: DateFormat },
    p0: { type: GraphQLString },
    q0: { type: GraphQLString },
    r0: { type: GraphQLString },
    s0: { type: GraphQLString },
    t0: { type: GraphQLString },
    u0: { type: GraphQLString },
    v0: { type: GraphQLString },
    w0: { type: GraphQLString },
    x0: { type: GraphQLString },
    y0: { type: GraphQLString },
    z0: { type: GraphQLString },
    aa0: { type: GraphQLString },
    ab0: { type: FloatPre2 },
    ac0: { type: IntPre0 },
    ad0: { type: FloatPre2 },
    ae0: { type: IntPre0 },
    af0: { type: FloatPre2 },
    ag0: { type: IntPre0 },
    ah0: { type: IntPre0 },
    ai0: { type: IntPre0 },
    aj0: { type: IntPre0 },
    ak0: { type: IntPre0 },
    al0: { type: IntPre0 },
    am0: { type: IntPre0 },
    an0: { type: IntPre0 },
    ao0: { type: IntPre0 },
    ap0: { type: IntPre0 },
    aq0: { type: IntPre0 },
    ar0: { type: IntPre0 },
    as0: { type: IntPre0 },
    at0: { type: IntPre0 },
    au0: { type: IntPre0 },
    av0: { type: IntPre0 },
    aw0: { type: IntPre0 },
    ax0: { type: IntPre0 },
    ba0: { type: IntPre0 },
    bb0: { type: IntPre0 },
    bc0: { type: IntPre0 },
    bd0: { type: IntPre0 },
    be0: { type: IntPre0 },
    bf0: { type: IntPre0 },
    bg0: { type: IntPre0 },
    bh0: { type: IntPre0 },
    bi0: { type: IntPre0 },
    bj0: { type: IntPre0 },
    bl0: { type: IntPre0 },
    bm0: { type: IntPre0 },
    bn0: { type: IntPre0 },
    bo0: { type: IntPre0 },
    bp0: { type: IntPre0 },
    bq0: { type: IntPre0 },
    br0: { type: IntPre0 },
    bs0: { type: IntPre0 },
    bt0: { type: IntPre0 },
    bu0: { type: IntPre0 },
    bv0: { type: IntPre0 },
    bw0: { type: IntPre0 },
    bx0: { type: IntPre0 },
    by0: { type: FloatPre2 },
    bz0: { type: IntPre0 },
    cw0: { type: FloatPre4 },
    cx0: { type: IntPre0 },
    dr0: { type: IntPre0 },
    ds0: { type: IntPre0 },
    dt0: { type: IntPre0 },
    du0: { type: IntPre0 },
    dv0: { type: IntPre0 },
    dw0: { type: IntPre0 },
    dx0: { type: IntPre0 },
    dy0: { type: IntPre0 },
  }),
});

const TotalType = new GraphQLObjectType({
  name: 'TotalType',
  fields: () => ({
    sab0: { type: IntPre0 },
    sac0: { type: IntPre0 },
    sad0: { type: IntPre0 },
    sae0: { type: IntPre0 },
    saf0: { type: IntPre0 },
    sag0: { type: IntPre0 },
    sah0: { type: IntPre0 },
    sai0: { type: IntPre0 },
    saj0: { type: IntPre0 },
    sak0: { type: IntPre0 },
    sal0: { type: IntPre0 },
    sam0: { type: IntPre0 },
    san0: { type: IntPre0 },
    sao0: { type: IntPre0 },
    sap0: { type: IntPre0 },
    saq0: { type: IntPre0 },
    sar0: { type: IntPre0 },
    sas0: { type: IntPre0 },
    sat0: { type: IntPre0 },
    sau0: { type: IntPre0 },
    sav0: { type: IntPre0 },
    saw0: { type: IntPre0 },
    sba0: { type: IntPre0 },
    sbb0: { type: IntPre0 },
    sbc0: { type: IntPre0 },
    sbd0: { type: IntPre0 },
    sbe0: { type: IntPre0 },
    sbf0: { type: IntPre0 },
    sbg0: { type: IntPre0 },
    sbh0: { type: IntPre0 },
    sbi0: { type: IntPre0 },
    sbj0: { type: IntPre0 },
    sbl0: { type: IntPre0 },
    sbm0: { type: IntPre0 },
    sbn0: { type: IntPre0 },
    sbo0: { type: IntPre0 },
    sbp0: { type: IntPre0 },
    sbq0: { type: IntPre0 },
    sbr0: { type: IntPre0 },
    sbs0: { type: IntPre0 },
    sbt0: { type: IntPre0 },
    sbu0: { type: IntPre0 },
    sbv0: { type: IntPre0 },
    sbw0: { type: IntPre0 },
    sbx0: { type: IntPre0 },
    sby0: { type: FloatPre2 },
    sbz0: { type: IntPre0 },
    scw0: { type: IntPre0 },
    scx0: { type: IntPre0 },
    sdr0: { type: IntPre0 },
    sds0: { type: IntPre0 },
    sdt0: { type: IntPre0 },
    sdu0: { type: IntPre0 },
    sdv0: { type: IntPre0 },
    sdw0: { type: IntPre0 },
    sdx0: { type: IntPre0 },
    sdy0: { type: IntPre0 },
  }),
});

const PayrollType = new GraphQLObjectType({
  name: 'PayrollType',
  fields: () => ({
    _id: { type: GraphQLString },
    from: { type: GraphQLString },
    to: { type: GraphQLString },
    year: { type: GraphQLInt },
    period: { type: GraphQLString },
    employee: { type: new GraphQLList(EmployeeType) },
    total: { type: TotalType },
  }),
});

module.exports = { PayrollType };
