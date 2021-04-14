const { GraphQLString } = require('graphql');
const Payroll = require('../payroll/model');
const { PayrollType, GenType } = require('../payroll/type');
const auth = require('../auth/service');
const { genPDF } = require('./method');

const ktg = async (id) => {
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
            ay0: '$employee.ay0',
            cb0: '$employee.cb0',
            cc0: '$employee.cc0',
            cd0: '$employee.cd0',
            ce0: '$employee.ce0',
            ci0: '$employee.ci0',
            cj0: '$employee.cj0',
            cm0: '$employee.cm0',
            ck0: '$employee.ck0',
            ex0: '$employee.ex0',
          },
        },
        sum1: { $sum: '$employee.ay0' },
        sum2: { $sum: '$employee.cb0' },
        sum3: { $sum: '$employee.cc0' },
        sum4: { $sum: '$employee.cd0' },
        sum5: { $sum: '$employee.ce0' },
        sum6: { $sum: '$employee.ci0' },
        sum7: { $sum: '$employee.cj0' },
        sum8: { $sum: '$employee.cm0' },
      },
    },
  ]);

  return p[0];
};

const Query = {
  ketenagakerjaanReport: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await ktg(id);
      return p;
    }),
  },
};

const Mutation = {
  genPDFKtg: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await ktg(id);
      const s = await genPDF(p);
      return s;
    }),
  },
};

module.exports = { Query, Mutation };
