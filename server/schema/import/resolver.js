const {
  processImportPayroll,
  processImportESlip,
  processImportThr,
  processImportKantin,
} = require('./method');
const { ImportInputType, KantinInputType } = require('./input.type');
const { PayrollType, GenType } = require('../payroll/type');
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
      const p = await processImportPayroll(input);
      return p;
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
  importKantin: {
    type: GenType,
    args: {
      input: { type: KantinInputType },
    },
    resolve: auth.hasRole('admin', async (_, { input }) => {
      const p = await processImportKantin(input);
      return p;
    }),
  },
};

module.exports = {
  Query,
  Mutation,
};
