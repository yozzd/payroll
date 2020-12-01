const { processImportPayroll, processImportESlip, processImportThr } = require('./method');
const { ImportInputType } = require('./input.type');
const { PayrollType } = require('../payroll/type');
const { ESlipType } = require('../eslip/type');
const { ThrType } = require('../thr/type');
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
  importThr: {
    type: ThrType,
    args: {
      input: { type: ImportInputType },
    },
    resolve: auth.hasRole('admin', async (_, { input }) => {
      const process = await processImportThr(input);
      return process;
    }),
  },
};

module.exports = {
  Query,
  Mutation,
};
