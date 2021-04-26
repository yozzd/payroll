const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
} = require('graphql');

const fs = require('fs-extra');
const { DateFormat } = require('../scalar/date');

const SlipCheckType = new GraphQLObjectType({
  name: 'SlipCheckType',
  fields: () => ({
    name: { type: GraphQLString },
    dir: { type: GraphQLString },
    check: {
      type: GraphQLBoolean,
      resolve: async (p) => {
        try {
          await fs.access(`static/slip/${p.dir}/${p.name}.pdf`);
          return true;
        } catch (err) {
          if (err) return false;
          return false;
        }
      },
    },
  }),
});

const FinalCheckType = new GraphQLObjectType({
  name: 'FinalCheckType',
  fields: () => ({
    name: { type: GraphQLString },
    dir: { type: GraphQLString },
    check: {
      type: GraphQLBoolean,
      resolve: async (p) => {
        try {
          await fs.access(`static/final/${p.dir}/${p.name}.pdf`);
          return true;
        } catch (err) {
          if (err) return false;
          return false;
        }
      },
    },
  }),
});

const PphCheckType = new GraphQLObjectType({
  name: 'PphCheckType',
  fields: () => ({
    name: { type: GraphQLString },
    dir: { type: GraphQLString },
    check: {
      type: GraphQLBoolean,
      resolve: async (p) => {
        try {
          await fs.access(`static/pph/${p.dir}/${p.name}.pdf`);
          return true;
        } catch (err) {
          if (err) return false;
          return false;
        }
      },
    },
  }),
});

const ThrSlipCheckType = new GraphQLObjectType({
  name: 'ThrSlipCheckType',
  fields: () => ({
    name: { type: GraphQLString },
    dir: { type: GraphQLString },
    check: {
      type: GraphQLBoolean,
      resolve: async (p) => {
        try {
          await fs.access(`static/thrSlip/${p.dir}/${p.name}.pdf`);
          return true;
        } catch (err) {
          if (err) return false;
          return false;
        }
      },
    },
  }),
});

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
    l0: { type: GraphQLFloat },
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
    ab0: { type: GraphQLFloat },
    ac0: { type: GraphQLFloat },
    ad0: { type: GraphQLFloat },
    ae0: { type: GraphQLFloat },
    af0: { type: GraphQLFloat },
    ag0: { type: GraphQLFloat },
    ah0: { type: GraphQLFloat },
    ai0: { type: GraphQLFloat },
    aj0: { type: GraphQLFloat },
    aj0r: { type: GraphQLFloat },
    ak0: { type: GraphQLFloat },
    ak0r: { type: GraphQLFloat },
    al0: { type: GraphQLFloat },
    al0r: { type: GraphQLFloat },
    am0: { type: GraphQLFloat },
    am0r: { type: GraphQLFloat },
    am0f: { type: GraphQLBoolean },
    am0p: { type: GraphQLFloat },
    an0: { type: GraphQLFloat },
    an0r: { type: GraphQLFloat },
    ao0: { type: GraphQLFloat },
    ao0r: { type: GraphQLFloat },
    ap0: { type: GraphQLFloat },
    ap0r: { type: GraphQLFloat },
    aq0: { type: GraphQLFloat },
    aq0r: { type: GraphQLFloat },
    ar0: { type: GraphQLFloat },
    ar0r: { type: GraphQLFloat },
    as0: { type: GraphQLFloat },
    as0r: { type: GraphQLFloat },
    as0f: { type: GraphQLBoolean },
    as0p: { type: GraphQLFloat },
    at0: { type: GraphQLFloat },
    at0r: { type: GraphQLFloat },
    at0f: { type: GraphQLBoolean },
    at0p: { type: GraphQLFloat },
    au0: { type: GraphQLFloat },
    au0r: { type: GraphQLFloat },
    au0f: { type: GraphQLBoolean },
    au0p: { type: GraphQLFloat },
    av0: { type: GraphQLFloat },
    av0r: { type: GraphQLFloat },
    aw0: { type: GraphQLFloat },
    ax0: { type: GraphQLFloat },
    ax0F: { type: GraphQLFloat },
    ay0: { type: GraphQLFloat },
    ba0: { type: GraphQLFloat },
    ba0r: { type: GraphQLFloat },
    bb0: { type: GraphQLFloat },
    bb0r: { type: GraphQLFloat },
    bc0: { type: GraphQLFloat },
    bc0r: { type: GraphQLFloat },
    bd0: { type: GraphQLFloat },
    bd0r: { type: GraphQLFloat },
    be0: { type: GraphQLFloat },
    be0r: { type: GraphQLFloat },
    bf0: { type: GraphQLFloat },
    bf0r: { type: GraphQLFloat },
    bg0: { type: GraphQLFloat },
    bg0r: { type: GraphQLFloat },
    bh0: { type: GraphQLFloat },
    bh0r: { type: GraphQLFloat },
    bi0: { type: GraphQLFloat },
    bi0r: { type: GraphQLFloat },
    bj0: { type: GraphQLFloat },
    bk0: { type: GraphQLFloat },
    bl0: { type: GraphQLFloat },
    bm0: { type: GraphQLFloat },
    bn0: { type: GraphQLFloat },
    bo0: { type: GraphQLFloat },
    bp0: { type: GraphQLFloat },
    bq0: { type: GraphQLFloat },
    br0: { type: GraphQLFloat },
    bs0: { type: GraphQLFloat },
    bt0: { type: GraphQLFloat },
    bu0: { type: GraphQLFloat },
    bv0: { type: GraphQLFloat },
    bw0: { type: GraphQLFloat },
    bx0: { type: GraphQLFloat },
    by0: { type: GraphQLFloat },
    bz0: { type: GraphQLFloat },
    ca0: { type: GraphQLFloat },
    cb0: { type: GraphQLFloat },
    cc0: { type: GraphQLFloat },
    cd0: { type: GraphQLFloat },
    ce0: { type: GraphQLFloat },
    cg0: { type: GraphQLFloat },
    ci0: { type: GraphQLFloat },
    cj0: { type: GraphQLFloat },
    ck0: { type: GraphQLString },
    cm0: { type: GraphQLFloat },
    cn0: { type: GraphQLFloat },
    co0: { type: GraphQLFloat },
    cq0: { type: GraphQLFloat },
    cr0: { type: GraphQLFloat },
    cs0: { type: GraphQLFloat },
    ct0: { type: GraphQLString },
    cu0: { type: GraphQLFloat },
    cw0: { type: GraphQLFloat },
    cx0: { type: GraphQLFloat },
    cy0: { type: GraphQLFloat },
    cz0: { type: GraphQLFloat },
    da0: { type: GraphQLFloat },
    db0: { type: GraphQLFloat },
    dc0: { type: GraphQLFloat },
    dd0: { type: GraphQLFloat },
    de0: { type: GraphQLFloat },
    df0: { type: GraphQLFloat },
    dg0: { type: GraphQLFloat },
    dh0: { type: GraphQLFloat },
    di0: { type: GraphQLFloat },
    dj0: { type: GraphQLFloat },
    dk0: { type: GraphQLFloat },
    dl0: { type: GraphQLFloat },
    dm0: { type: GraphQLFloat },
    dn0: { type: GraphQLFloat },
    do0: { type: GraphQLFloat },
    dp0: { type: GraphQLFloat },
    dr0: { type: GraphQLFloat },
    ds0: { type: GraphQLFloat },
    dt0: { type: GraphQLFloat },
    du0: { type: GraphQLFloat },
    dv0: { type: GraphQLFloat },
    dw0: { type: GraphQLFloat },
    dx0: { type: GraphQLFloat },
    dy0: { type: GraphQLFloat },
    dz0: { type: GraphQLString },
    ea0: { type: GraphQLInt },
    eb0: { type: GraphQLFloat },
    ec0: { type: GraphQLFloat },
    ec0F: { type: GraphQLFloat },
    ed0: { type: GraphQLFloat },
    ef0: { type: GraphQLFloat },
    eg0: { type: GraphQLFloat },
    eh0: { type: GraphQLFloat },
    ei0: { type: GraphQLFloat },
    ej0: { type: GraphQLFloat },
    ek0: { type: GraphQLFloat },
    el0: { type: GraphQLFloat },
    em0: { type: GraphQLFloat },
    en0: { type: GraphQLFloat },
    eo0: { type: GraphQLFloat },
    eq0: { type: GraphQLFloat },
    er0: { type: GraphQLFloat },
    es0: { type: GraphQLFloat },
    et0: { type: GraphQLString },
    ew0: { type: GraphQLString },
    ex0: { type: GraphQLBoolean },
    ey0: { type: GraphQLBoolean },
    ez0: { type: GraphQLBoolean },
    fb0: { type: GraphQLBoolean },
    fc0: { type: GraphQLFloat },
    fe0: { type: GraphQLFloat },
    fj0: { type: GraphQLBoolean },
    fl0: { type: GraphQLBoolean },
    slip: { type: SlipCheckType },
    final: { type: FinalCheckType },
    gross: { type: GraphQLFloat },
    ttax: { type: GraphQLFloat },
    fDate: { type: DateFormat },
    pph: { type: PphCheckType },
    spAllowRem: { type: GraphQLString },
    trfThr: { type: GraphQLFloat },
    cshThr: { type: GraphQLFloat },
    thr: { type: ThrSlipCheckType },
    payPass: { type: GraphQLBoolean },
  }),
});

module.exports = { EmployeeType };
