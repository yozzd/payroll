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
      const payroll = await Payroll.find({ year }).sort('-month');
      return payroll;
    }),
  },
};

const Mutation = {};

module.exports = {
  Query,
  Mutation,
};
