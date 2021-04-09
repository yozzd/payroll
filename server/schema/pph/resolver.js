const { GraphQLString } = require('graphql');
const Payroll = require('../payroll/model');
const { PayrollType, GenType } = require('../payroll/type');
const auth = require('../auth/service');
const { genPDF } = require('./method');

const Query = {
  pphReport: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const payroll = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
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
                ex0: '$employee.ex0',
                pph: {
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
};

const Mutation = {
  genPph: {
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
                l0: '$employee.l0',
                r0: '$employee.r0',
                ai0: '$employee.ai0',
                bk0: '$employee.bk0',
                bu0: '$employee.bu0',
                bz0: '$employee.bz0',
                cb0: '$employee.cb0',
                cc0: '$employee.cc0',
                cq0: '$employee.cq0',
                cy0: '$employee.cy0',
                df0: '$employee.df0',
                dr0: '$employee.dr0',
                ea0: '$employee.ea0',
                pph: {
                  name: '$employee.slip.name',
                },
                bruto: { $subtract: [{ $sum: ['$employee.l0', '$employee.bk0', '$employee.ai0', '$employee.cb0', '$employee.cc0', '$employee.cq0', '$employee.bu0', '$employee.dr0', '$employee.bz0'] }, { $sum: ['$employee.df0', '$employee.cy0'] }] },
              },
            },
          },
        },
      ]);

      const s = await genPDF(p[0]);
      return s;
    }),
  },
};

module.exports = { Query, Mutation };
