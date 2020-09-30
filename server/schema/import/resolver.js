const { processImportPayroll, processImportESlip } = require('./method');
const { ImportInputType } = require('./input.type');
const { PayrollType } = require('../payroll/type');
const { ESlipType } = require('../eslip/type');
const auth = require('../auth/service');

const Query = {};

const Mutation = {
  importPayroll: {
    type: PayrollType,
    args: {
      input: { type: ImportInputType },
    },
    resolve: auth.hasRole('admin', async (_, { input }) => {
      const process = await processImportPayroll(input);
      return process;
    }),
  },
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
