const { GraphQLString } = require('graphql');
const Payroll = require('../payroll/model');
const { GenType } = require('../payroll/type');
const auth = require('../auth/service');
const { genPDF, genXLS } = require('./method');
const { PercentageType } = require('./type');

const percentage = async (id) => {
  const p = await Payroll.aggregate([
    { $match: { _id: id } },
    { $unwind: '$employee' },
    {
      $group: {
        _id: {
          id: '$_id',
          dept: '$employee.u0',
          count: { $sum: 1 },
        },
        period: { $first: '$period' },
        year: { $first: '$year' },
        dir: { $first: '$dir' },
        upah: { $sum: '$employee.ax0' },
        ot: { $sum: '$employee.ai0' },
        active: { $sum: { $cond: { if: { $eq: ['$employee.ex0', false] }, then: 1, else: 0 } } },
        finalPay: { $sum: { $cond: { if: { $eq: ['$employee.ex0', true] }, then: 1, else: 0 } } },
      },
    },
    {
      $addFields: {
        percentage: { $multiply: [{ $divide: ['$ot', '$upah'] }, 100] },
      },
    },
    {
      $group: {
        _id: '$_id.id',
        period: { $first: '$period' },
        year: { $first: '$year' },
        dir: { $first: '$dir' },
        category: {
          $push: {
            department: '$_id.dept',
            upah: '$upah',
            ot: '$ot',
            active: '$active',
            finalPay: '$finalPay',
            percentage: '$percentage',
          },
        },
        totUpah: { $sum: '$upah' },
        totOt: { $sum: '$ot' },
        totActive: { $sum: '$active' },
        totFinalPay: { $sum: '$finalPay' },
        count: { $sum: '$_id.count' },
        tp: { $sum: '$percentage' },
      },
    },
    {
      $addFields: {
        totPercentage: { $divide: ['$tp', '$count'] },
      },
    },
  ]);

  return p[0];
};

const Query = {
  percentageReport: {
    type: PercentageType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await percentage(id);
      return p;
    }),
  },
};

const Mutation = {
  genPDFPercentage: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await percentage(id);
      const s = await genPDF(p);
      return s;
    }),
  },
  genXLSPercentage: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await percentage(id);
      const s = await genXLS(p);
      return s;
    }),
  },
};

module.exports = { Query, Mutation };
