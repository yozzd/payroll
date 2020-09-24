const { processImportESlip } = require('./method');
const { ImportInputType } = require('./input.type');
const { ESlipType } = require('../eslip/type');
const auth = require('../auth/service');

const Query = {};

const Mutation = {
  importESlip: {
    type: ESlipType,
    args: {
      input: { type: ImportInputType },
    },
    resolve: auth.hasRole('admin', async (_, { input }) => {
      const process = await processImportESlip(input);
      return process;
    }),
  },
};

module.exports = {
  Query,
  Mutation,
};
