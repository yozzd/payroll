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
                ab0: '$employee.ab0',
                ac0: '$employee.ac0',
                ad0: '$employee.ad0',
                ae0: '$employee.ae0',
                af0: '$employee.af0',
                ag0: '$employee.ag0',
                ah0: '$employee.ah0',
                ai0: '$employee.ai0',
              },
            },
          },
        },
        {
          $addFields: {
            total: {
              sab0: { $round: [{ $sum: '$employee.ab0' }, 0] },
              sac0: { $round: [{ $sum: '$employee.ac0' }, 0] },
              sad0: { $round: [{ $sum: '$employee.ad0' }, 0] },
              sae0: { $round: [{ $sum: '$employee.ae0' }, 0] },
              saf0: { $round: [{ $sum: '$employee.af0' }, 0] },
              sag0: { $round: [{ $sum: '$employee.ag0' }, 0] },
              sah0: { $round: [{ $sum: '$employee.ah0' }, 0] },
              sai0: { $round: [{ $sum: '$employee.ai0' }, 0] },
            },
          },
        },
      ]);

      return p[0];
    }),
  },
  payrollFixedAllowance: {
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
                aw0: '$employee.aw0',
                ax0: '$employee.ax0',
              },
            },
          },
        },
        {
          $addFields: {
            total: {
              saj0: { $sum: '$employee.aj0' },
              sak0: { $sum: '$employee.ak0' },
              sal0: { $sum: '$employee.al0' },
              sam0: { $sum: '$employee.am0' },
              san0: { $sum: '$employee.an0' },
              sao0: { $sum: '$employee.ao0' },
              sap0: { $sum: '$employee.ap0' },
              saq0: { $sum: '$employee.aq0' },
              sar0: { $sum: '$employee.ar0' },
              sas0: { $sum: '$employee.as0' },
              sat0: { $sum: '$employee.at0' },
              sau0: { $sum: '$employee.au0' },
              sav0: { $sum: '$employee.av0' },
              saw0: { $sum: '$employee.aw0' },
              sax0: { $sum: '$employee.ax0' },
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
