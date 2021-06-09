const { GraphQLInt } = require('graphql');
const { GenType } = require('../payroll/type');
const auth = require('../auth/service');
const { SummaryType } = require('./type');
const {
  genPDFSumBasic,
  genXLSSumBasic,
  genPDFSumOT,
  genXLSSumOT,
  genPDFSumAllow,
  genXLSSumAllow,
  genPDFSumOAllow,
  genXLSSumOAllow,
  genPDFSumPesangon,
  genXLSSumPesangon,
  genPDFSumThr,
  genXLSSumThr,
  genPDFSumOIncome,
  genXLSSumOIncome,
  genPDFSumAbsent,
  genXLSSumAbsent,
} = require('./method');
const {
  sumBasic,
  sumOT,
  sumAllow,
  sumOAllow,
  sumPesangon,
  sumThr,
  sumOIncome,
  sumAbsent,
} = require('./query');

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
  summaryOT: {
    type: SummaryType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumOT(id);
      return p;
    }),
  },
  summaryAllow: {
    type: SummaryType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumAllow(id);
      return p;
    }),
  },
  summaryOAllow: {
    type: SummaryType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumOAllow(id);
      return p;
    }),
  },
  summaryPesangon: {
    type: SummaryType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumPesangon(id);
      return p;
    }),
  },
  summaryThr: {
    type: SummaryType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumThr(id);
      return p;
    }),
  },
  summaryOIncome: {
    type: SummaryType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumOIncome(id);
      return p;
    }),
  },
  summaryAbsent: {
    type: SummaryType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumAbsent(id);
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
  genPDFSummaryOT: {
    type: GenType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumOT(id);
      const s = await genPDFSumOT(p, id);
      return s;
    }),
  },
  genXLSSummaryOT: {
    type: GenType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumOT(id);
      const s = await genXLSSumOT(p, id);
      return s;
    }),
  },
  genPDFSummaryAllow: {
    type: GenType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumAllow(id);
      const s = await genPDFSumAllow(p, id);
      return s;
    }),
  },
  genXLSSummaryAllow: {
    type: GenType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumAllow(id);
      const s = await genXLSSumAllow(p, id);
      return s;
    }),
  },
  genPDFSummaryOAllow: {
    type: GenType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumOAllow(id);
      const s = await genPDFSumOAllow(p, id);
      return s;
    }),
  },
  genXLSSummaryOAllow: {
    type: GenType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumOAllow(id);
      const s = await genXLSSumOAllow(p, id);
      return s;
    }),
  },
  genPDFSummaryPesangon: {
    type: GenType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumPesangon(id);
      const s = await genPDFSumPesangon(p, id);
      return s;
    }),
  },
  genXLSSummaryPesangon: {
    type: GenType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumPesangon(id);
      const s = await genXLSSumPesangon(p, id);
      return s;
    }),
  },
  genPDFSummaryThr: {
    type: GenType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumThr(id);
      const s = await genPDFSumThr(p, id);
      return s;
    }),
  },
  genXLSSummaryThr: {
    type: GenType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumThr(id);
      const s = await genXLSSumThr(p, id);
      return s;
    }),
  },
  genPDFSummaryOIncome: {
    type: GenType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumOIncome(id);
      const s = await genPDFSumOIncome(p, id);
      return s;
    }),
  },
  genXLSSummaryOIncome: {
    type: GenType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumOIncome(id);
      const s = await genXLSSumOIncome(p, id);
      return s;
    }),
  },
  genPDFSummaryAbsent: {
    type: GenType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumAbsent(id);
      const s = await genPDFSumAbsent(p, id);
      return s;
    }),
  },
  genXLSSummaryAbsent: {
    type: GenType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await sumAbsent(id);
      const s = await genXLSSumAbsent(p, id);
      return s;
    }),
  },
};

module.exports = { Query, Mutation };
