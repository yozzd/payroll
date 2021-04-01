const { GraphQLString } = require('graphql');
const Payroll = require('../payroll/model');
const { PayrollType, GenType } = require('../payroll/type');
const auth = require('../auth/service');
const { genPDF } = require('./method');

const byTansfer = async(id) => {
  const p = await Payroll.aggregate([
    { $match: { _id: id } },
    { $unwind: '$employee' },
    { $match: { 'employee.ex0': false } },
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
            s0: '$employee.s0',
            t0: '$employee.t0',
            ec0: '$employee.ec0',
            ec0F: {
              $function: {
                body: `function(v) {
                  return Math.floor(v / 100) * 100;
                }`,
                args: ['$employee.ec0'],
                lang: 'js',
              },
            },
          },
        },
        sum1: { $sum: '$employee.ec0' },
      },
    },
    {
      $addFields: {
        sum2: { $sum: '$employee.ec0F' },
      },
    },
  ]);

  return p[0];
};

const Query = {
  trfReport: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await byTansfer(id);
      return p;
    }),
  },
};

const Mutation = {
  genPDFTrf: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await byTansfer(id);
      const s = await genPDF(p);
      return s;
    }),
  },
};

module.exports = { Query, Mutation };
