const { GraphQLString, GraphQLInt } = require('graphql');
const Payroll = require('../payroll/model');
const { PayrollType, GenType } = require('../payroll/type');
const auth = require('../auth/service');
const { genPDF, genXLS } = require('./method');
const { sBasic } = require('./query');

const Query = {
  summaryBasic: {
    type: PayrollType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sBasic(id);
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
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await byTansfer(id);
      const s = await genPDF(p);
      return s;
    }),
  },
  genXLSTrf: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await byTansfer(id);
      const s = await genXLS(p);
      return s;
    }),
  },
};

module.exports = { Query, Mutation };
