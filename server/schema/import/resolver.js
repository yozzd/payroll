const {
  processImportPayroll,
  processImportESlip,
  processImportThr,
  processImportTax,
  processImportKantin,
  processImportKoperasi,
  processImportOvertime,
  processImportProrate,
} = require('./method');
const { ImportInputType, ExtImportInputType } = require('./input.type');
const { PayrollType, GenType } = require('../payroll/type');
const { ESlipType } = require('../eslip/type');
const { ThrType } = require('../thr/type');
const { TaxType } = require('../tax/type');
const { ProrateType } = require('../prorate/type');
const auth = require('../auth/service');

const Query = {};

const Mutation = {
  importPayroll: {
    type: PayrollType,
    args: {
      input: { type: ImportInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const p = await processImportPayroll(input);
      return p;
    }),
  },
  importESlip: {
    type: ESlipType,
    args: {
      input: { type: ImportInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const process = await processImportESlip(input);
      return process;
    }),
  },
  importThr: {
    type: ThrType,
    args: {
      input: { type: ImportInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const process = await processImportThr(input);
      return process;
    }),
  },
  importTax: {
    type: TaxType,
    args: {
      input: { type: ImportInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const process = await processImportTax(input);
      return process;
    }),
  },
  importProrate: {
    type: ProrateType,
    args: {
      input: { type: ImportInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const process = await processImportProrate(input);
      return process;
    }),
  },
  importKantin: {
    type: GenType,
    args: {
      input: { type: ExtImportInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const p = await processImportKantin(input);
      return p;
    }),
  },
  importKoperasi: {
    type: GenType,
    args: {
      input: { type: ExtImportInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const p = await processImportKoperasi(input);
      return p;
    }),
  },
  importOvertime: {
    type: GenType,
    args: {
      input: { type: ExtImportInputType },
    },
    resolve: auth.hasRole('user', async (_, { input }) => {
      const p = await processImportOvertime(input);
      return p;
    }),
  },
};

module.exports = {
  Query,
  Mutation,
};
