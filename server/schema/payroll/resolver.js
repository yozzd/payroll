const fs = require('fs-extra');
const { intervalToDuration } = require('date-fns');
const {
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = require('graphql');
const Payroll = require('./model.js');
const { PayrollType, GenType, SendType } = require('./type');
const {
  updateEmployee,
  generateSlip,
  sendSlip,
  generateReportPayroll,
  genPayrollXLS,
  genAccCheck,
  genFinal,
  genPDFSpAllowQ,
  genPDFThrQ,
  genXLSThrQ,
} = require('./method');
const {
  CloneEmployeeInputType,
  EditEmploymentInputType,
  EditPrivateInputType,
  EditBasicInputType,
  EditOvertimeInputType,
  EditFixedAllowanceInputType,
  EditNonFixedAllowanceInputType,
  EditRetroFillInputType,
  EditLeaveInputType,
  EditEarningOthersInputType,
  EditAbsentInputType,
  EditTaxInputType,
  EditFeeInputType,
  EditReductionInputType,
  EditDeductionOthersInputType,
  EditFlagsEmployeeInputType,
  EditManualEmployeeInputType,
  EditFinalEmployeeInputType,
  EditSpAllowInputType,
} = require('./employee.input.type.js');
const {
  AddEmployeeInputType,
  ClonePayrollInputType,
  DeleteInputType,
} = require('./input.type');
const auth = require('../auth/service');

const countHR = (tgl1, tgl2) => {
  if (!tgl1) return 0;

  const { years, months, days } = intervalToDuration({
    start: new Date(tgl1), end: new Date(tgl2),
  });

  if (years > 0) return 12;
  if (years === 0 && days >= 15) return months + 1;
  return months;
};

const group = {
  _id: '$_id',
  period: { $first: '$period' },
  year: { $first: '$year' },
  dir: { $first: '$dir' },
  employee: { $push: '$employee' },
  g0Sum: { $sum: '$employee.g0' },
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
  cw0Sum: { $sum: '$employee.cw0' },
  cx0Sum: { $sum: '$employee.cx0' },
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
      $group: group,
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
      $group: group,
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
            ],
          },
          {
            $and: [
              { typeHR: { $eq: 2 } },
              { 'employee.et0': { $ne: 'Islam' } },
            ],
          },
        ],
      },
    },
    {
      $group: {
        _id: '$_id',
        dir: { $first: '$dir' },
        period: { $first: '$period' },
        year: { $first: '$year' },
        tglHR: { $first: '$tglHR' },
        employee: {
          $push: {
            _id: '$employee._id',
            d0: '$employee.d0',
            e0: '$employee.e0',
            g0: '$employee.g0',
            h0: '$employee.h0',
            i0: '$employee.i0',
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
            ax0: '$employee.ax0',
            bw0: '$employee.bw0',
            bx0: '$employee.bx0',
            cz0: '$employee.cz0',
            da0: '$employee.da0',
            db0: '$employee.db0',
            ax0F: {
              $function: {
                body: `function(v) {
                  return Math.floor(v / 100) * 100;
                }`,
                args: ['$employee.ax0'],
                lang: 'js',
              },
            },
            trfThr: {
              $cond: {
                if: { $ne: ['$employee.e0', 'X.0010'] },
                then: {
                  $subtract: [
                    {
                      $function: {
                        body: `function(v) {
                          return Math.floor(v / 100) * 100;
                        }`,
                        args: ['$employee.ax0'],
                        lang: 'js',
                      },
                    },
                    '$employee.db0',
                  ],
                },
                else: 0,
              },
            },
            cshThr: {
              $cond: {
                if: { $eq: ['$employee.e0', 'X.0010'] },
                then: {
                  $subtract: [
                    {
                      $function: {
                        body: `function(v) {
                          return Math.floor(v / 100) * 100;
                        }`,
                        args: ['$employee.ax0'],
                        lang: 'js',
                      },
                    },
                    '$employee.db0',
                  ],
                },
                else: 0,
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        bx0Sum: { $sum: '$employee.bx0' },
        g0Sum: { $sum: '$employee.g0' },
        aj0Sum: { $sum: '$employee.aj0' },
        ak0Sum: { $sum: '$employee.ak0' },
        al0Sum: { $sum: '$employee.al0' },
        am0Sum: { $sum: '$employee.am0' },
        ao0Sum: { $sum: '$employee.ao0' },
        ap0Sum: { $sum: '$employee.ap0' },
        aq0Sum: { $sum: '$employee.aq0' },
        as0Sum: { $sum: '$employee.as0' },
        at0Sum: { $sum: '$employee.at0' },
        au0Sum: { $sum: '$employee.au0' },
        ax0Sum: { $sum: '$employee.ax0' },
        ax0FSum: { $sum: '$employee.ax0F' },
        cz0Sum: { $sum: '$employee.cz0' },
        da0Sum: { $sum: '$employee.da0' },
        trfThrSum: { $sum: '$employee.trfThr' },
        cshThrSum: { $sum: '$employee.cshThr' },
      },
    },
  ]);
  return payroll[0];
};

const Query = {
  payrollAll: {
    type: new GraphQLList(PayrollType),
    args: {
      year: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { year }) => {
      const p = await Payroll.find({ year }).sort('-month');
      return p;
    }),
  },
  payrollPeriod: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id }).select('period year');
      return p;
    }),
  },
  payrollEmployment: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.h0': 1,
          'employee.i0': 1,
          'employee.k0': 1,
          'employee.u0': 1,
          'employee.v0': 1,
          'employee.w0': 1,
          'employee.x0': 1,
          'employee.y0': 1,
          'employee.ex0': 1,
        });
      return p;
    }),
  },
  payrollPrivate: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.n0': 1,
          'employee.o0': 1,
          'employee.p0': 1,
          'employee.q0': 1,
          'employee.r0': 1,
          'employee.s0': 1,
          'employee.t0': 1,
          'employee.z0': 1,
          'employee.aa0': 1,
          'employee.et0': 1,
          'employee.ew0': 1,
          'employee.ex0': 1,
        });
      return p;
    }),
  },
  payrollBasic: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.g0': 1,
          'employee.j0': 1,
          'employee.l0': 1,
          'employee.ay0': 1,
          'employee.ex0': 1,
        });
      return p;
    }),
  },
  payrollOvertime: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.ab0': 1,
          'employee.ac0': 1,
          'employee.ad0': 1,
          'employee.ae0': 1,
          'employee.af0': 1,
          'employee.ag0': 1,
          'employee.ah0': 1,
          'employee.ai0': 1,
          'employee.ex0': 1,
        });
      return p;
    }),
  },
  payrollFixedAllowance: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.aj0': 1,
          'employee.aj0r': 1,
          'employee.ak0': 1,
          'employee.ak0r': 1,
          'employee.al0': 1,
          'employee.al0r': 1,
          'employee.am0': 1,
          'employee.am0r': 1,
          'employee.an0': 1,
          'employee.an0r': 1,
          'employee.ao0': 1,
          'employee.ao0r': 1,
          'employee.ap0': 1,
          'employee.ap0r': 1,
          'employee.aq0': 1,
          'employee.aq0r': 1,
          'employee.ar0': 1,
          'employee.ar0r': 1,
          'employee.as0': 1,
          'employee.as0r': 1,
          'employee.at0': 1,
          'employee.at0r': 1,
          'employee.au0': 1,
          'employee.au0r': 1,
          'employee.av0': 1,
          'employee.av0r': 1,
          'employee.aw0': 1,
          'employee.ex0': 1,
        });
      return p;
    }),
  },
  payrollNonFixedAllowance: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.ba0': 1,
          'employee.ba0r': 1,
          'employee.bb0': 1,
          'employee.bb0r': 1,
          'employee.bc0': 1,
          'employee.bc0r': 1,
          'employee.bd0': 1,
          'employee.bd0r': 1,
          'employee.be0': 1,
          'employee.be0r': 1,
          'employee.bf0': 1,
          'employee.bf0r': 1,
          'employee.bg0': 1,
          'employee.bg0r': 1,
          'employee.bh0': 1,
          'employee.bh0r': 1,
          'employee.bi0': 1,
          'employee.bi0r': 1,
          'employee.bj0': 1,
          'employee.ex0': 1,
        });
      return p;
    }),
  },
  payrollRetroFill: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.bl0': 1,
          'employee.bm0': 1,
          'employee.bn0': 1,
          'employee.bo0': 1,
          'employee.bp0': 1,
          'employee.bq0': 1,
          'employee.br0': 1,
          'employee.bs0': 1,
          'employee.bt0': 1,
          'employee.bu0': 1,
          'employee.ex0': 1,
        });
      return p;
    }),
  },
  payrollLeave: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.by0': 1,
          'employee.bz0': 1,
          'employee.ex0': 1,
        });
      return p;
    }),
  },
  payrollEarningOthers: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.bv0': 1,
          'employee.bw0': 1,
          'employee.bx0': 1,
          'employee.dr0': 1,
          'employee.ds0': 1,
          'employee.dt0': 1,
          'employee.du0': 1,
          'employee.dv0': 1,
          'employee.dw0': 1,
          'employee.dx0': 1,
          'employee.dy0': 1,
          'employee.ex0': 1,
        });
      return p;
    }),
  },
  payrollAbsent: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.cw0': 1,
          'employee.cx0': 1,
          'employee.ex0': 1,
        });
      return p;
    }),
  },
  payrollFee: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.cb0': 1,
          'employee.cc0': 1,
          'employee.cd0': 1,
          'employee.ce0': 1,
          'employee.ci0': 1,
          'employee.cj0': 1,
          'employee.ck0': 1,
          'employee.cq0': 1,
          'employee.cr0': 1,
          'employee.ct0': 1,
          'employee.co0': 1,
          'employee.ex0': 1,
        });
      return p;
    }),
  },
  payrollTax: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.cz0': 1,
          'employee.da0': 1,
          'employee.db0': 1,
          'employee.dz0': 1,
          'employee.ea0': 1,
          'employee.es0': 1,
          'employee.ex0': 1,
        });
      return p;
    }),
  },
  payrollReduction: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.dc0': 1,
          'employee.dd0': 1,
          'employee.de0': 1,
          'employee.dg0': 1,
          'employee.dh0': 1,
          'employee.di0': 1,
          'employee.dj0': 1,
          'employee.ex0': 1,
        });
      return p;
    }),
  },
  payrollDeductionOthers: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.dk0': 1,
          'employee.dl0': 1,
          'employee.dm0': 1,
          'employee.dn0': 1,
          'employee.ex0': 1,
        });
      return p;
    }),
  },
  payrollPayment: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.ca0': 1,
          'employee.do0': 1,
          'employee.dp0': 1,
          'employee.eb0': 1,
          'employee.ec0': 1,
          'employee.ed0': 1,
          'employee.ex0': 1,
        });
      return p;
    }),
  },
  payrollSlip: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const payroll = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        // { $match: { 'employee.ex0': false } },
        {
          $group: {
            _id: '$_id',
            period: { $first: '$period' },
            year: { $first: '$year' },
            employee: {
              $push: {
                _id: '$employee._id',
                d0: '$employee.d0',
                e0: '$employee.e0',
                ew0: '$employee.ew0',
                ex0: '$employee.ex0',
                slip: {
                  name: '$employee.slip.name',
                  dir: '$dir',
                },
              },
            },
          },
        },
      ]);
      return payroll[0];
    }),
  },
  payrollFlags: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.ex0': 1,
          'employee.ey0': 1,
          'employee.ez0': 1,
          'employee.fb0': 1,
          'employee.fj0': 1,
          'employee.fl0': 1,
          'employee.am0f': 1,
          'employee.am0p': 1,
          'employee.as0f': 1,
          'employee.as0p': 1,
          'employee.at0f': 1,
          'employee.at0p': 1,
          'employee.au0f': 1,
          'employee.au0p': 1,
        });
      return p;
    }),
  },
  payrollManual: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.fc0': 1,
          'employee.fe0': 1,
          'employee.ex0': 1,
        });
      return p;
    }),
  },
  payrollFinal: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
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
                fDate: '$employee.fDate',
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
    }),
  },
  payrollSpAllow: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const s = await spAllowQ(id);
      return s;
    }),
  },
  payrollThr: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await thrCat(id);
      return p;
    }),
  },
};

const Mutation = {
  payrollDelete: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id });
      await fs.remove(`static/slip/${p.dir}`);
      await fs.remove(`static/report/${p.dir}`);
      await Payroll.findOneAndDelete({ _id: id });
      return { _id: id };
    }),
  },
  generateSlip: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
      eId: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id, eId }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        { $match: { 'employee._id': eId } },
      ]);
      const s = await generateSlip(p[0]);
      return s;
    }),
  },
  sendSlip: {
    type: SendType,
    args: {
      id: { type: GraphQLString },
      eId: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id, eId }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        { $match: { 'employee._id': eId } },
      ]);
      const s = await sendSlip(p[0]);
      return s;
    }),
  },
  generateReportPayroll: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await a3Report(id);
      const s = await generateReportPayroll(p);
      return s;
    }),
  },
  generatePayrollXLS: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await a3Report(id);
      const s = await genPayrollXLS(p);
      return s;
    }),
  },
  genPayrollXLSNoFin: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await a3ReportNoFin(id);
      const s = await genPayrollXLS(p);
      return s;
    }),
  },
  generateAccCheck: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        {
          $group: {
            _id: '$_id',
            period: { $first: '$period' },
            year: { $first: '$year' },
            dir: { $first: '$dir' },
            employee: {
              $push: {
                _id: '$employee._id',
                d0: '$employee.d0',
                e0: '$employee.e0',
                dk0: '$employee.dk0',
                dl0: '$employee.dl0',
                dm0: '$employee.dm0',
                dg0: '$employee.dg0',
                bv0: '$employee.bv0',
              },
            },
            dk0sum: { $sum: '$employee.dk0' },
            dl0sum: { $sum: '$employee.dl0' },
            dm0sum: { $sum: '$employee.dm0' },
            dg0sum: { $sum: '$employee.dg0' },
            bv0sum: { $sum: '$employee.bv0' },
          },
        },
      ]);

      const s = await genAccCheck(p[0]);
      return s;
    }),
  },
  addEmployee: {
    type: GenType,
    args: {
      input: { type: AddEmployeeInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const {
        _id, d0, e0, g0, h0, i0, j0,
        k0, n0, o0, p0, r0, u0, v0,
        co0, ew0,
      } = input;
      const px = await Payroll.findOne({ _id });

      px.employee.push({
        d0: d0.toUpperCase(),
        e0,
        g0,
        h0,
        i0,
        j0,
        k0,
        n0,
        o0,
        p0,
        r0,
        u0,
        v0,
        ay0: g0,
        co0,
        ew0,
      });
      await px.save();
      return { sStatus: 1 };
    }),
  },
  cloneEmployee: {
    type: GenType,
    args: {
      input: { type: CloneEmployeeInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, e0 } = input;
      const px = await Payroll.findOne({ _id });

      let m; let
        y;
      if (px.month < 1) {
        m = 11;
        y = px.year - 1;
      } else {
        m = px.month - 1;
        y = px.year;
      }

      const py = await Payroll.aggregate([
        { $match: { $and: [{ month: m }, { year: y }] } },
        { $unwind: '$employee' },
        { $match: { 'employee.e0': e0 } },
        { $project: { 'employee._id': 0 } },
      ]);

      px.employee.push(py[0].employee);
      await px.save();
      return { sStatus: 1 };
    }),
  },
  editEmployment: {
    type: PayrollType,
    args: {
      input: { type: EditEmploymentInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      const s = updateEmployee(_id, employee, Payroll);
      return s;
    }),
  },
  editPrivate: {
    type: PayrollType,
    args: {
      input: { type: EditPrivateInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      const s = updateEmployee(_id, employee, Payroll);
      return s;
    }),
  },
  editBasic: {
    type: PayrollType,
    args: {
      input: { type: EditBasicInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      const s = updateEmployee(_id, employee, Payroll);
      return s;
    }),
  },
  editOvertime: {
    type: PayrollType,
    args: {
      input: { type: EditOvertimeInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      const s = updateEmployee(_id, employee, Payroll);
      return s;
    }),
  },
  editFixedAllowance: {
    type: PayrollType,
    args: {
      input: { type: EditFixedAllowanceInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      const s = updateEmployee(_id, employee, Payroll);
      return s;
    }),
  },
  editNonFixedAllowance: {
    type: PayrollType,
    args: {
      input: { type: EditNonFixedAllowanceInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      const s = updateEmployee(_id, employee, Payroll);
      return s;
    }),
  },
  editRetroFill: {
    type: PayrollType,
    args: {
      input: { type: EditRetroFillInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      const s = updateEmployee(_id, employee, Payroll);
      return s;
    }),
  },
  editLeave: {
    type: PayrollType,
    args: {
      input: { type: EditLeaveInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      const s = updateEmployee(_id, employee, Payroll);
      return s;
    }),
  },
  editEarningOthers: {
    type: PayrollType,
    args: {
      input: { type: EditEarningOthersInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      const s = updateEmployee(_id, employee, Payroll);
      return s;
    }),
  },
  editAbsent: {
    type: PayrollType,
    args: {
      input: { type: EditAbsentInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      const s = updateEmployee(_id, employee, Payroll);
      return s;
    }),
  },
  editTax: {
    type: PayrollType,
    args: {
      input: { type: EditTaxInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      const s = updateEmployee(_id, employee, Payroll);
      return s;
    }),
  },
  editFee: {
    type: PayrollType,
    args: {
      input: { type: EditFeeInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      const s = updateEmployee(_id, employee, Payroll);
      return s;
    }),
  },
  editReduction: {
    type: PayrollType,
    args: {
      input: { type: EditReductionInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      const s = updateEmployee(_id, employee, Payroll);
      return s;
    }),
  },
  editDeductionOthers: {
    type: PayrollType,
    args: {
      input: { type: EditDeductionOthersInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      const s = updateEmployee(_id, employee, Payroll);
      return s;
    }),
  },
  editFlagsEmployee: {
    type: PayrollType,
    args: {
      input: { type: EditFlagsEmployeeInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      const s = updateEmployee(_id, employee, Payroll);
      return s;
    }),
  },
  editManualEmployee: {
    type: PayrollType,
    args: {
      input: { type: EditManualEmployeeInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      const s = updateEmployee(_id, employee, Payroll);
      return s;
    }),
  },
  clonePayroll: {
    type: PayrollType,
    args: {
      input: { type: ClonePayrollInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, from, to } = input;
      const px = await Payroll.findOne({ _id });
      const pn = new Payroll({
        from,
        to,
        rate: px.rate,
      });

      const arr1 = px.employee.filter((v) => v.fg0 !== true && v.ff0 !== true && v.ex0 !== true);
      const arr2 = arr1.map((o) => {
        const v = o;
        v.j0 = 21;
        v.ab0 = 0;
        v.ad0 = 0;
        v.af0 = 0;
        v.bb0 = 0;
        v.bb0r = 0;
        v.bc0 = 0;
        v.bc0r = 0;
        v.bd0 = 0;
        v.bd0r = 0;
        v.bl0 = 0;
        v.bm0 = 0;
        v.bn0 = 0;
        v.bo0 = 0;
        v.bp0 = 0;
        v.bq0 = 0;
        v.br0 = 0;
        v.bs0 = 0;
        v.bt0 = 0;
        v.bv0 = 0;
        v.bw0 = 0;
        v.by0 = 0;
        v.ck0 = '';
        v.ct0 = '';
        v.cw0 = 0;
        v.dc0 = 0;
        v.dd0 = 0;
        v.de0 = 0;
        v.dg0 = 0;
        v.dh0 = 0;
        v.di0 = 0;
        v.dk0 = 0;
        v.dl0 = 0;
        v.dm0 = 0;
        v.dn0 = 0;
        v.dq0 = 0;
        v.dr0 = 0;
        v.fl0 = false;

        return v;
      });
      Object.assign(pn.employee, arr2);

      const s = await pn.save();
      return s;
    }),
  },
  hariRaya: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
      typeHR: { type: GraphQLInt },
      tglHR: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id, typeHR, tglHR }) => {
      const px = await Payroll.findById(id);
      if (!typeHR) {
        px.typeHR = 0;
        px.tglHR = '';

        px.employee.map((o) => {
          const v = o;
          v.bw0 = 0;
          v.bx0 = 0;

          return v;
        });
      } else {
        px.typeHR = typeHR;
        px.tglHR = tglHR;

        px.employee.map((o) => {
          const v = o;

          if (typeHR === 1) {
            if (v.et0 === 'Islam') v.bw0 = countHR(v.i0, tglHR);
            else v.bw0 = 0;
          } else if (v.et0 !== 'Islam') v.bw0 = countHR(v.i0, tglHR);
          else v.bw0 = 0;

          return v;
        });
      }

      const s = await px.save();
      return s;
    }),
  },
  employeeDelete: {
    type: new GraphQLList(PayrollType),
    args: {
      id: { type: GraphQLString },
      del: { type: new GraphQLList(DeleteInputType) },
    },
    resolve: auth.hasRole('user', async (_, { id, del }) => {
      const px = await Payroll.findById(id);
      await Promise.all(
        del.map(async (v) => {
          await px.employee.id(v._id).remove();
        }),
      );
      await px.save();
      return del;
    }),
  },
  payrollFreeze: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
      freeze: { type: GraphQLBoolean },
    },
    resolve: auth.hasRole('admin', async (_, { id, freeze }) => {
      const px = await Payroll.findById(id);
      px.freeze = !freeze;
      const s = await px.save();
      return s;
    }),
  },
  generateFinal: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
      eId: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id, eId }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        { $match: { 'employee._id': eId } },
      ]);
      const s = await genFinal(p[0]);
      return s;
    }),
  },
  editFinalEmployee: {
    type: PayrollType,
    args: {
      input: { type: EditFinalEmployeeInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      await updateEmployee(_id, employee, Payroll);
      const p = await Payroll.aggregate([
        { $match: { _id } },
        { $unwind: '$employee' },
        { $match: { 'employee.ex0': true } },
        { $sort: { 'employee.e0': 1 } },
        {
          $group: {
            _id: '$_id',
            freeze: { $first: '$freeze' },
            employee: {
              $push: {
                _id: '$employee._id',
                d0: '$employee.d0',
                e0: '$employee.e0',
                fDate: '$employee.fDate',
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
    }),
  },
  editSpAllow: {
    type: PayrollType,
    args: {
      input: { type: EditSpAllowInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const { _id, employee } = input;
      await updateEmployee(_id, employee, Payroll);

      const s = await spAllowQ(_id);
      return s;
    }),
  },
  genPDFSpAllow: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await spAllowQ(id);
      const s = await genPDFSpAllowQ(p);
      return s;
    }),
  },
  genPDFThr: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await thrCat(id);
      const s = await genPDFThrQ(p);
      return s;
    }),
  },
  genXLSThr: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await thrCat(id);
      const s = await genXLSThrQ(p);
      return s;
    }),
  },
};

module.exports = {
  Query,
  Mutation,
};
