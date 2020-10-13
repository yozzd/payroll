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
                ex0: '$employee.ex0',
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
                ex0: '$employee.ex0',
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
            },
          },
        },
      ]);

      return p[0];
    }),
  },
  payrollNonFixedAllowance: {
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
                ba0: '$employee.ba0',
                bb0: '$employee.bb0',
                bc0: '$employee.bc0',
                bd0: '$employee.bd0',
                be0: '$employee.be0',
                bf0: '$employee.bf0',
                bg0: '$employee.bg0',
                bh0: '$employee.bh0',
                bi0: '$employee.bi0',
                bj0: '$employee.bj0',
                ex0: '$employee.ex0',
              },
            },
          },
        },
        {
          $addFields: {
            total: {
              sba0: { $sum: '$employee.ba0' },
              sbb0: { $sum: '$employee.bb0' },
              sbc0: { $sum: '$employee.bc0' },
              sbd0: { $sum: '$employee.bd0' },
              sbe0: { $sum: '$employee.be0' },
              sbf0: { $sum: '$employee.bf0' },
              sbg0: { $sum: '$employee.bg0' },
              sbh0: { $sum: '$employee.bh0' },
              sbi0: { $sum: '$employee.bi0' },
              sbj0: { $sum: '$employee.bj0' },
            },
          },
        },
      ]);

      return p[0];
    }),
  },
  payrollRetroFill: {
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
                bl0: '$employee.bl0',
                bm0: '$employee.bm0',
                bn0: '$employee.bn0',
                bo0: '$employee.bo0',
                bp0: '$employee.bp0',
                bq0: '$employee.bq0',
                br0: '$employee.br0',
                bs0: '$employee.bs0',
                bt0: '$employee.bt0',
                bu0: '$employee.bu0',
                ex0: '$employee.ex0',
              },
            },
          },
        },
        {
          $addFields: {
            total: {
              sbl0: { $sum: '$employee.bl0' },
              sbm0: { $sum: '$employee.bm0' },
              sbn0: { $sum: '$employee.bn0' },
              sbo0: { $sum: '$employee.bo0' },
              sbp0: { $sum: '$employee.bp0' },
              sbq0: { $sum: '$employee.bq0' },
              sbr0: { $sum: '$employee.br0' },
              sbs0: { $sum: '$employee.bs0' },
              sbt0: { $sum: '$employee.bt0' },
              sbu0: { $sum: '$employee.bu0' },
            },
          },
        },
      ]);

      return p[0];
    }),
  },
  payrollEarningOthers: {
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
                bv0: '$employee.bv0',
                bw0: '$employee.bw0',
                bx0: '$employee.bx0',
                by0: '$employee.by0',
                bz0: '$employee.bz0',
                dr0: '$employee.dr0',
                ds0: '$employee.ds0',
                dt0: '$employee.dt0',
                du0: '$employee.du0',
                dv0: '$employee.dv0',
                dw0: '$employee.dw0',
                dx0: '$employee.dx0',
                dy0: '$employee.dy0',
                ex0: '$employee.ex0',
              },
            },
          },
        },
        {
          $addFields: {
            total: {
              sbv0: { $sum: '$employee.bv0' },
              sbw0: { $sum: '$employee.bw0' },
              sbx0: { $sum: '$employee.bx0' },
              sby0: { $sum: '$employee.by0' },
              sbz0: { $sum: '$employee.bz0' },
              sdr0: { $sum: '$employee.dr0' },
              sds0: { $sum: '$employee.ds0' },
              sdt0: { $sum: '$employee.dt0' },
              sdu0: { $sum: '$employee.du0' },
              sdv0: { $sum: '$employee.dv0' },
              sdw0: { $sum: '$employee.dw0' },
              sdx0: { $sum: '$employee.dx0' },
              sdy0: { $round: [{ $sum: '$employee.dy0' }, 0] },
            },
          },
        },
      ]);

      return p[0];
    }),
  },
  payrollAbsent: {
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
                cw0: '$employee.cw0',
                cx0: '$employee.cx0',
                ex0: '$employee.ex0',
              },
            },
          },
        },
        {
          $addFields: {
            total: {
              scw0: { $round: [{ $sum: '$employee.cw0' }, 0] },
              scx0: { $round: [{ $sum: '$employee.cx0' }, 0] },
            },
          },
        },
      ]);

      return p[0];
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
