const { GraphQLString } = require('graphql');
const Payroll = require('../payroll/model');
const { PayrollType, GenType } = require('../payroll/type');
const auth = require('../auth/service');
const { genPDF } = require('./method');

const kes = async (id) => {
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
            o0: '$employee.o0',
            z0: '$employee.z0',
            aa0: '$employee.aa0',
            co0: '$employee.co0',
            cq0: '$employee.cq0',
            cr0: '$employee.cr0',
            cs0: '$employee.cs0',
            ct0: '$employee.ct0',
            cu0: '$employee.cu0',
            ex0: '$employee.ex0',
          },
        },
        sum1: { $sum: '$employee.co0' },
        sum2: { $sum: '$employee.cq0' },
        sum3: { $sum: '$employee.cr0' },
        sum4: { $sum: '$employee.cu0' },
      },
    },
  ]);

  return p[0];
};

const Query = {
  kesehatanReport: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await kes(id);
      return p;
    }),
  },
};

const Mutation = {
  genPDFKes: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await kes(id);
      const s = await genPDF(p);
      return s;
    }),
  },
};

module.exports = { Query, Mutation };
