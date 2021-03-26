const fs = require('fs-extra');
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
  EditReductionInputType,
  EditDeductionOthersInputType,
  EditFlagsEmployeeInputType,
  EditManualEmployeeInputType,
} = require('./employee.input.type.js');
const {
  AddEmployeeInputType,
  ClonePayrollInputType,
  DeleteInputType,
} = require('./input.type');
const auth = require('../auth/service');

const Query = {
  payrollAll: {
    type: new GraphQLList(PayrollType),
    args: {
      year: { type: GraphQLInt },
    },
    resolve: auth.hasRole('user', async (_, { year }) => {
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
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.findOne({ _id: id })
        .select({
          _id: 1,
          freeze: 1,
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
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.cb0': 1,
          'employee.cc0': 1,
          'employee.cd0': 1,
          'employee.ce0': 1,
          'employee.ci0': 1,
          'employee.cj0': 1,
          'employee.cq0': 1,
          'employee.cr0': 1,
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
          'employee._id': 1,
          'employee.d0': 1,
          'employee.e0': 1,
          'employee.cz0': 1,
          'employee.da0': 1,
          'employee.db0': 1,
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
    resolve: auth.hasRole('user', async (_, { id }) => {
      const payroll = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        { $match: { 'employee.ex0': { $ne: 1 } } },
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
            freeze: { $first: '$freeze' },
            employee: {
              $push: {
                _id: '$employee._id',
                d0: '$employee.d0',
                e0: '$employee.e0',
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
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
      ]);
      const s = await generateReportPayroll(p[0]);
      return s;
    }),
  },
  generatePayrollXLS: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
      ]);
      const s = await genPayrollXLS(p[0]);
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
        _id, d0, e0, g0, j0,
      } = input;
      const px = await Payroll.findOne({ _id });

      px.employee.push({
        d0,
        e0,
        g0,
        j0,
        ay0: g0,
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

      const arr = px.employee.filter((v) => v.fg0 !== true && v.ff0 !== true && v.ex0 !== true);
      Object.assign(pn.employee, arr);

      const s = await pn.save();
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
};

module.exports = {
  Query,
  Mutation,
};
