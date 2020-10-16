const {
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} = require('graphql');
const Payroll = require('./model.js');
const { PayrollType } = require('./type');
const auth = require('../auth/service');

const Query = {
  payrollAll: {
    type: new GraphQLList(PayrollType),
    args: {
      year: { type: GraphQLInt },
    },
    resolve: auth.hasRole('admin', async (_, { year }) => {
      const p = await Payroll.find({ year }).sort('-month');
      return p;
    }),
  },
  payrollPeriod: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id }).select('period year');
      return p;
    }),
  },
  payrollEmployment: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
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
  payrollSocial: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.p0': 1,
          'employee.q0': 1,
          'employee.r0': 1,
          'employee.s0': 1,
          'employee.t0': 1,
          'employee.z0': 1,
          'employee.aa0': 1,
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
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
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
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.aj0': 1,
          'employee.ak0': 1,
          'employee.al0': 1,
          'employee.am0': 1,
          'employee.an0': 1,
          'employee.ao0': 1,
          'employee.ap0': 1,
          'employee.aq0': 1,
          'employee.ar0': 1,
          'employee.as0': 1,
          'employee.at0': 1,
          'employee.au0': 1,
          'employee.av0': 1,
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
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.ba0': 1,
          'employee.bb0': 1,
          'employee.bc0': 1,
          'employee.bd0': 1,
          'employee.be0': 1,
          'employee.bf0': 1,
          'employee.bg0': 1,
          'employee.bh0': 1,
          'employee.bi0': 1,
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
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
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
  payrollEarningOthers: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.bv0': 1,
          'employee.bw0': 1,
          'employee.bx0': 1,
          'employee.by0': 1,
          'employee.bz0': 1,
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
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
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
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        {
          $group: {
            _id: '$_id',
            employee: {
              $push: {
                _id: '$employee._id',
                d0: '$employee.d0',
                e0: '$employee.e0',
                cb0: '$employee.cb0',
                cc0: '$employee.cc0',
                cd0: '$employee.cd0',
                ce0: '$employee.ce0',
                ci0: '$employee.ci0',
                cj0: '$employee.cj0',
                cq0: '$employee.cq0',
                cr0: '$employee.cr0',
                ex0: '$employee.ex0',
              },
            },
          },
        },
        {
          $addFields: {
            total: {
              scb0: { $round: [{ $sum: '$employee.cb0' }, 0] },
              scc0: { $round: [{ $sum: '$employee.cc0' }, 0] },
              scd0: { $round: [{ $sum: '$employee.cd0' }, 0] },
              sce0: { $round: [{ $sum: '$employee.ce0' }, 0] },
              sci0: { $round: [{ $sum: '$employee.ci0' }, 0] },
              scj0: { $round: [{ $sum: '$employee.cj0' }, 0] },
              scq0: { $round: [{ $sum: '$employee.cq0' }, 0] },
              scr0: { $round: [{ $sum: '$employee.cr0' }, 0] },
            },
          },
        },
      ]);

      return p[0];
    }),
  },
  payrollTax: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        {
          $group: {
            _id: '$_id',
            employee: {
              $push: {
                _id: '$employee._id',
                d0: '$employee.d0',
                e0: '$employee.e0',
                cz0: '$employee.cz0',
                da0: '$employee.da0',
                db0: '$employee.db0',
                ex0: '$employee.ex0',
              },
            },
          },
        },
        {
          $addFields: {
            total: {
              scz0: { $round: [{ $sum: '$employee.cz0' }, 0] },
              sda0: { $round: [{ $sum: '$employee.da0' }, 0] },
              sdb0: { $round: [{ $sum: '$employee.db0' }, 0] },
            },
          },
        },
      ]);

      return p[0];
    }),
  },
  payrollReduction: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        {
          $group: {
            _id: '$_id',
            employee: {
              $push: {
                _id: '$employee._id',
                d0: '$employee.d0',
                e0: '$employee.e0',
                dc0: '$employee.dc0',
                dd0: '$employee.dd0',
                de0: '$employee.de0',
                dg0: '$employee.dg0',
                dh0: '$employee.dh0',
                di0: '$employee.di0',
                dj0: '$employee.dj0',
                ex0: '$employee.ex0',
              },
            },
          },
        },
        {
          $addFields: {
            total: {
              sdc0: { $sum: '$employee.dc0' },
              sdd0: { $sum: '$employee.dd0' },
              sde0: { $sum: '$employee.de0' },
              sdg0: { $sum: '$employee.dg0' },
              sdh0: { $sum: '$employee.dh0' },
              sdi0: { $sum: '$employee.di0' },
              sdj0: { $sum: '$employee.dj0' },
            },
          },
        },
      ]);

      return p[0];
    }),
  },
  payrollDeductionOthers: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        {
          $group: {
            _id: '$_id',
            employee: {
              $push: {
                _id: '$employee._id',
                d0: '$employee.d0',
                e0: '$employee.e0',
                dk0: '$employee.dk0',
                dl0: '$employee.dl0',
                dm0: '$employee.dm0',
                dn0: '$employee.dn0',
                ex0: '$employee.ex0',
              },
            },
          },
        },
        {
          $addFields: {
            total: {
              sdk0: { $sum: '$employee.dk0' },
              sdl0: { $sum: '$employee.dl0' },
              sdm0: { $sum: '$employee.dm0' },
              sdn0: { $sum: '$employee.dn0' },
            },
          },
        },
      ]);

      return p[0];
    }),
  },
  payrollPayment: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        {
          $group: {
            _id: '$_id',
            employee: {
              $push: {
                _id: '$employee._id',
                d0: '$employee.d0',
                e0: '$employee.e0',
                ca0: '$employee.ca0',
                do0: '$employee.do0',
                dp0: '$employee.dp0',
                eb0: '$employee.eb0',
                ec0: '$employee.ec0',
                ed0: '$employee.ed0',
                ex0: '$employee.ex0',
              },
            },
          },
        },
        {
          $addFields: {
            total: {
              sca0: { $round: [{ $sum: '$employee.ca0' }, 0] },
              sdo0: { $round: [{ $sum: '$employee.do0' }, 0] },
              sdp0: { $round: [{ $sum: '$employee.dp0' }, 0] },
              seb0: { $round: [{ $sum: '$employee.eb0' }, 0] },
              sec0: { $round: [{ $sum: '$employee.ec0' }, 0] },
              sed0: { $round: [{ $sum: '$employee.ed0' }, 0] },
            },
          },
        },
      ]);

      return p[0];
    }),
  },
};

const Mutation = {
  payrollDelete: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id }) => {
      await Payroll.findOneAndDelete({ _id: id });
      return { _id: id };
    }),
  },
};

module.exports = {
  Query,
  Mutation,
};
