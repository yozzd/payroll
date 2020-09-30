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
