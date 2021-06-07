const { GraphQLInt } = require('graphql');
const { GenType } = require('../payroll/type');
const auth = require('../auth/service');
const { SummaryType } = require('./type');
const { genPDFSumBasic, genXLSSumBasic } = require('./method');
const { sumBasic } = require('./query');

const Query = {
  summaryBasic: {
    type: SummaryType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumBasic(id);
      return p;
    }),
  },
};

const Mutation = {
  genPDFSummaryBasic: {
    type: GenType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumBasic(id);
      const s = await genPDFSumBasic(p, id);
      return s;
    }),
  },
  genXLSSummaryBasic: {
    type: GenType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumBasic(id);
      const s = await genXLSSumBasic(p, id);
      return s;
    }),
  },
};

module.exports = { Query, Mutation };
