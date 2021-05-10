const Payroll = require('./model.js');

const a3Group = {
  _id: '$_id',
  period: { $first: '$period' },
  year: { $first: '$year' },
  dir: { $first: '$dir' },
  employee: { $push: '$employee' },
  f0Sum: { $sum: '$employee.f0' },
  g0Sum: { $sum: '$employee.g0' },
  l0Sum: { $sum: '$employee.l0' },
  ab0Sum: { $sum: '$employee.ab0' },
  ac0Sum: { $sum: '$employee.ac0' },
  ad0Sum: { $sum: '$employee.ad0' },
  ae0Sum: { $sum: '$employee.ae0' },
  af0Sum: { $sum: '$employee.af0' },
  ag0Sum: { $sum: '$employee.ag0' },
  ah0Sum: { $sum: '$employee.ah0' },
  ai0Sum: { $sum: '$employee.ai0' },
  aj0Sum: { $sum: '$employee.aj0' },
  ak0Sum: { $sum: '$employee.ak0' },
  al0Sum: { $sum: '$employee.al0' },
  am0Sum: { $sum: '$employee.am0' },
  an0Sum: { $sum: '$employee.an0' },
  ao0Sum: { $sum: '$employee.ao0' },
  ap0Sum: { $sum: '$employee.ap0' },
  aq0Sum: { $sum: '$employee.aq0' },
  ar0Sum: { $sum: '$employee.ar0' },
  as0Sum: { $sum: '$employee.as0' },
  at0Sum: { $sum: '$employee.at0' },
  au0Sum: { $sum: '$employee.au0' },
  av0Sum: { $sum: '$employee.av0' },
  aw0Sum: { $sum: '$employee.aw0' },
  ax0Sum: { $sum: '$employee.ax0' },
  ay0Sum: { $sum: '$employee.ay0' },
  az0Sum: { $sum: '$employee.az0' },
  ba0Sum: { $sum: '$employee.ba0' },
  bb0Sum: { $sum: '$employee.bb0' },
  bc0Sum: { $sum: '$employee.bc0' },
  bd0Sum: { $sum: '$employee.bd0' },
  be0Sum: { $sum: '$employee.be0' },
  bf0Sum: { $sum: '$employee.bf0' },
  bg0Sum: { $sum: '$employee.bg0' },
  bh0Sum: { $sum: '$employee.bh0' },
  bi0Sum: { $sum: '$employee.bi0' },
  bj0Sum: { $sum: '$employee.bj0' },
  bk0Sum: { $sum: '$employee.bk0' },
  bl0Sum: { $sum: '$employee.bl0' },
  bm0Sum: { $sum: '$employee.bm0' },
  bn0Sum: { $sum: '$employee.bn0' },
  bo0Sum: { $sum: '$employee.bo0' },
  bp0Sum: { $sum: '$employee.bp0' },
  bq0Sum: { $sum: '$employee.bq0' },
  br0Sum: { $sum: '$employee.br0' },
  bs0Sum: { $sum: '$employee.bs0' },
  bt0Sum: { $sum: '$employee.bt0' },
  bu0Sum: { $sum: '$employee.bu0' },
  bv0Sum: { $sum: '$employee.bv0' },
  bw0Sum: { $sum: '$employee.bw0' },
  bx0Sum: { $sum: '$employee.bx0' },
  by0Sum: { $sum: '$employee.by0' },
  bz0Sum: { $sum: '$employee.bz0' },
  ca0Sum: { $sum: '$employee.ca0' },
  cb0Sum: { $sum: '$employee.cb0' },
  cc0Sum: { $sum: '$employee.cc0' },
  cd0Sum: { $sum: '$employee.cd0' },
  ce0Sum: { $sum: '$employee.ce0' },
  cf0Sum: { $sum: '$employee.cf0' },
  cg0Sum: { $sum: '$employee.cg0' },
  ch0Sum: { $sum: '$employee.ch0' },
  ci0Sum: { $sum: '$employee.ci0' },
  cj0Sum: { $sum: '$employee.cj0' },
  cl0Sum: { $sum: '$employee.cl0' },
  cm0Sum: { $sum: '$employee.cm0' },
  cn0Sum: { $sum: '$employee.cn0' },
  co0Sum: { $sum: '$employee.co0' },
  cp0Sum: { $sum: '$employee.cp0' },
  cq0Sum: { $sum: '$employee.cq0' },
  cr0Sum: { $sum: '$employee.cr0' },
  cu0Sum: { $sum: '$employee.cu0' },
  cv0Sum: { $sum: '$employee.cv0' },
  cw0Sum: { $sum: '$employee.cw0' },
  cx0Sum: { $sum: '$employee.cx0' },
  cy0Sum: { $sum: '$employee.cy0' },
  cz0Sum: { $sum: '$employee.cz0' },
  da0Sum: { $sum: '$employee.da0' },
  db0Sum: { $sum: '$employee.db0' },
  dc0Sum: { $sum: '$employee.dc0' },
  dd0Sum: { $sum: '$employee.dd0' },
  de0Sum: { $sum: '$employee.de0' },
  df0Sum: { $sum: '$employee.df0' },
  dg0Sum: { $sum: '$employee.dg0' },
  dh0Sum: { $sum: '$employee.dh0' },
  di0Sum: { $sum: '$employee.di0' },
  dj0Sum: { $sum: '$employee.dj0' },
  dk0Sum: { $sum: '$employee.dk0' },
  dl0Sum: { $sum: '$employee.dl0' },
  dm0Sum: { $sum: '$employee.dm0' },
  dn0Sum: { $sum: '$employee.dn0' },
  do0Sum: { $sum: '$employee.do0' },
  dp0Sum: { $sum: '$employee.dp0' },
  dr0Sum: { $sum: '$employee.dr0' },
  ds0Sum: { $sum: '$employee.ds0' },
  dt0Sum: { $sum: '$employee.dt0' },
  du0Sum: { $sum: '$employee.du0' },
  dv0Sum: { $sum: '$employee.dv0' },
  dw0Sum: { $sum: '$employee.dw0' },
  dx0Sum: { $sum: '$employee.dx0' },
  dy0Sum: { $sum: '$employee.dy0' },
  eb0Sum: { $sum: '$employee.eb0' },
  ec0Sum: { $sum: '$employee.ec0' },
  ed0Sum: { $sum: '$employee.ed0' },
};

const a3Report = async (id) => {
  const p = await Payroll.aggregate([
    { $match: { _id: id } },
    { $unwind: '$employee' },
    {
      $group: a3Group,
    },
  ]);

  return p[0];
};

const a3ReportNoFin = async (id) => {
  const p = await Payroll.aggregate([
    { $match: { _id: id } },
    { $unwind: '$employee' },
    { $match: { 'employee.ex0': false } },
    {
      $group: a3Group,
    },
  ]);

  return p[0];
};

const spAllowQ = async (id) => {
  const p = await Payroll.aggregate([
    { $match: { _id: id } },
    { $unwind: '$employee' },
    { $match: { 'employee.fl0': true } },
    { $sort: { 'employee.e0': 1 } },
    {
      $group: {
        _id: '$_id',
        period: { $first: '$period' },
        year: { $first: '$year' },
        dir: { $first: '$dir' },
        freeze: { $first: '$freeze' },
        employee: {
          $push: {
            _id: '$employee._id',
            d0: '$employee.d0',
            u0: '$employee.u0',
            e0: '$employee.e0',
            fl0: '$employee.fl0',
            al0: '$employee.al0',
            al0r: '$employee.al0r',
            al0p: '$employee.al0p',
            am0: '$employee.am0',
            am0r: '$employee.am0r',
            am0p: '$employee.am0p',
            as0: '$employee.as0',
            as0r: '$employee.as0r',
            as0p: '$employee.as0p',
            at0: '$employee.at0',
            at0r: '$employee.at0r',
            at0p: '$employee.at0p',
            au0: '$employee.au0',
            au0r: '$employee.au0r',
            au0p: '$employee.au0p',
            spAllowRem: '$employee.spAllowRem',
          },
        },
        al0Sum: { $sum: '$employee.al0' },
        al0rSum: { $sum: '$employee.al0r' },
        am0Sum: { $sum: '$employee.am0' },
        am0rSum: { $sum: '$employee.am0r' },
        as0Sum: { $sum: '$employee.as0' },
        as0rSum: { $sum: '$employee.as0r' },
        at0Sum: { $sum: '$employee.at0' },
        at0rSum: { $sum: '$employee.at0r' },
        au0Sum: { $sum: '$employee.au0' },
        au0rSum: { $sum: '$employee.au0r' },
      },
    },
  ]);

  return p[0];
};

const thrCatGroup = {
  _id: '$_id',
  dir: { $first: '$dir' },
  period: { $first: '$period' },
  year: { $first: '$year' },
  typeHR: { $first: '$typeHR' },
  tglHR: { $first: '$tglHR' },
  employee: {
    $push: {
      _id: '$employee._id',
      d0: '$employee.d0',
      e0: '$employee.e0',
      g0: '$employee.g0',
      h0: '$employee.h0',
      i0: '$employee.i0',
      o0: '$employee.o0',
      p0: '$employee.p0',
      q0: '$employee.q0',
      t0: '$employee.t0',
      u0: '$employee.u0',
      v0: '$employee.v0',
      y0: '$employee.y0',
      aj0: '$employee.aj0',
      ak0: '$employee.ak0',
      al0: '$employee.al0',
      am0: '$employee.am0',
      an0: '$employee.an0',
      ao0: '$employee.ao0',
      ap0: '$employee.ap0',
      aq0: '$employee.aq0',
      ar0: '$employee.ar0',
      as0: '$employee.as0',
      at0: '$employee.at0',
      au0: '$employee.au0',
      av0: '$employee.av0',
      ax0: '$employee.ax0',
      bw0: '$employee.bw0',
      bx0: '$employee.bx0',
      cz0: '$employee.cz0',
      da0: '$employee.da0',
      db0: '$employee.db0',
      ew0: '$employee.ew0',
      trfThr: {
        $cond: {
          if: { $ne: ['$employee.e0', 'X.0010'] },
          then: {
            $function: {
              body: `function(a, b) {
                return Math.floor((a - b) / 100) * 100;
              }`,
              args: ['$employee.bx0', '$employee.db0'],
              lang: 'js',
            },
          },
          else: 0,
        },
      },
      cshThr: {
        $cond: {
          if: { $eq: ['$employee.e0', 'X.0010'] },
          then: {
            $function: {
              body: `function(a, b) {
                return Math.floor((a - b) / 100) * 100;
              }`,
              args: ['$employee.bx0', '$employee.db0'],
              lang: 'js',
            },
          },
          else: 0,
        },
      },
      thr: {
        name: '$employee.slip.name',
        pw: '$employee.slip.pw',
        dir: '$dir',
      },
    },
  },
};

const thrCatAdd = {
  bx0Sum: { $sum: '$employee.bx0' },
  g0Sum: { $sum: '$employee.g0' },
  aj0Sum: { $sum: '$employee.aj0' },
  ak0Sum: { $sum: '$employee.ak0' },
  al0Sum: { $sum: '$employee.al0' },
  am0Sum: { $sum: '$employee.am0' },
  ao0Sum: { $sum: '$employee.ao0' },
  ap0Sum: { $sum: '$employee.ap0' },
  ar0Sum: { $sum: '$employee.ar0' },
  aq0Sum: { $sum: '$employee.aq0' },
  as0Sum: { $sum: '$employee.as0' },
  at0Sum: { $sum: '$employee.at0' },
  au0Sum: { $sum: '$employee.au0' },
  av0Sum: { $sum: '$employee.av0' },
  ax0Sum: { $sum: '$employee.ax0' },
  cz0Sum: { $sum: '$employee.cz0' },
  da0Sum: { $sum: '$employee.da0' },
  trfThrSum: { $sum: '$employee.trfThr' },
  cshThrSum: { $sum: '$employee.cshThr' },
};

const thrCat = async (id) => {
  const payroll = await Payroll.aggregate([
    { $match: { _id: id } },
    { $unwind: '$employee' },
    {
      $match: {
        $or: [
          {
            $and: [
              { typeHR: { $eq: 1 } },
              { 'employee.et0': { $eq: 'Islam' } },
              { 'employee.bw0': { $gt: 0 } },
            ],
          },
          {
            $and: [
              { typeHR: { $eq: 2 } },
              { 'employee.et0': { $ne: 'Islam' } },
              { 'employee.bw0': { $gt: 0 } },
            ],
          },
        ],
      },
    },
    {
      $group: thrCatGroup,
    },
    {
      $addFields: thrCatAdd,
    },
  ]);
  return payroll[0];
};

const thrCatPerson = async (id, eId) => {
  const payroll = await Payroll.aggregate([
    { $match: { _id: id } },
    { $unwind: '$employee' },
    { $match: { 'employee._id': eId } },
    {
      $group: thrCatGroup,
    },
  ]);
  return payroll[0];
};

const finalPayment = async (id) => {
  const p = await Payroll.aggregate([
    { $match: { _id: id } },
    { $unwind: '$employee' },
    { $match: { 'employee.ex0': true } },
    { $sort: { 'employee.e0': 1 } },
    {
      $group: {
        _id: '$_id',
        period: { $first: '$period' },
        year: { $first: '$year' },
        freeze: { $first: '$freeze' },
        employee: {
          $push: {
            _id: '$employee._id',
            d0: '$employee.d0',
            e0: '$employee.e0',
            g0: '$employee.g0',
            h0: '$employee.h0',
            i0: '$employee.i0',
            j0: '$employee.j0',
            k0: '$employee.k0',
            y0: '$employee.y0',
            ab0: '$employee.ab0',
            ad0: '$employee.ad0',
            af0: '$employee.af0',
            bv0: '$employee.bv0',
            bw0: '$employee.bw0',
            by0: '$employee.by0',
            cw0: '$employee.cw0',
            dh0: '$employee.dh0',
            dk0: '$employee.dk0',
            dl0: '$employee.dl0',
            dm0: '$employee.dm0',
            dn0: '$employee.dn0',
            ds0: '$employee.ds0',
            fe0: '$employee.fe0',
            fDate: '$employee.fDate',
            aj0r: '$employee.aj0r',
            ak0r: '$employee.ak0r',
            al0r: '$employee.al0r',
            am0r: '$employee.am0r',
            an0r: '$employee.an0r',
            ao0r: '$employee.ao0r',
            ap0r: '$employee.ap0r',
            aq0r: '$employee.aq0r',
            ar0r: '$employee.ar0r',
            as0r: '$employee.as0r',
            at0r: '$employee.at0r',
            au0r: '$employee.au0r',
            av0r: '$employee.av0r',
            ba0r: '$employee.ba0r',
            bb0r: '$employee.bb0r',
            bc0r: '$employee.bc0r',
            bd0r: '$employee.bd0r',
            be0r: '$employee.be0r',
            bf0r: '$employee.bf0r',
            bg0r: '$employee.bg0r',
            bh0r: '$employee.bh0r',
            bi0r: '$employee.bi0r',
            final: {
              name: '$employee.final.name',
              dir: '$dir',
            },
          },
        },
      },
    },
  ]);

  return p[0];
};

module.exports = {
  a3Report,
  a3ReportNoFin,
  spAllowQ,
  thrCat,
  thrCatPerson,
  finalPayment,
};
