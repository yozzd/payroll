const { GraphQLString } = require('graphql');
const Payroll = require('../payroll/model');
const { JournalType, JournalBalanceType } = require('./type');
const { GenType } = require('../payroll/type');
const auth = require('../auth/service');
const { genXLS } = require('./method');

const { journal } = require('./query');

const Query = {
  journalProduction: {
    type: JournalType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        { $match: { 'employee.category': 1 } },
        {
          $group: {
            _id: '$_id',
            employeeP: {
              $push: {
                _id: '$employee._id',
                d0: '$employee.d0',
                e0: '$employee.e0',
                l0: '$employee.l0',
                u0: '$employee.u0',
                v0: '$employee.v0',
                w0: '$employee.w0',
                y0: '$employee.y0',
                ai0: '$employee.ai0',
                bu0: '$employee.bu0',
                bv0: '$employee.bv0',
                bx0: '$employee.bx0',
                cb0: '$employee.cb0',
                cc0: '$employee.cc0',
                cg0: '$employee.cg0',
                cq0: '$employee.cq0',
                cs0: '$employee.cs0',
                cy0: '$employee.cy0',
                df0: '$employee.df0',
                ef0: '$employee.ef0',
                eg0: '$employee.eg0',
                eh0: '$employee.eh0',
                ei0: '$employee.ei0',
                ej0: '$employee.ej0',
                ek0: '$employee.ek0',
                el0: '$employee.el0',
                em0: '$employee.em0',
                eo0: '$employee.eo0',
                es0: '$employee.es0',
              },
            },
          },
        },
      ]);

      return p[0];
    }),
  },
  journalAdministration: {
    type: JournalType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        { $match: { 'employee.category': 0 } },
        {
          $group: {
            _id: '$_id',
            employeeA: {
              $push: {
                _id: '$employee._id',
                d0: '$employee.d0',
                e0: '$employee.e0',
                l0: '$employee.l0',
                u0: '$employee.u0',
                v0: '$employee.v0',
                w0: '$employee.w0',
                y0: '$employee.y0',
                ai0: '$employee.ai0',
                bu0: '$employee.bu0',
                bv0: '$employee.bv0',
                bx0: '$employee.bx0',
                cb0: '$employee.cb0',
                cc0: '$employee.cc0',
                cg0: '$employee.cg0',
                cq0: '$employee.cq0',
                cs0: '$employee.cs0',
                cy0: '$employee.cy0',
                df0: '$employee.df0',
                ef0: '$employee.ef0',
                eg0: '$employee.eg0',
                eh0: '$employee.eh0',
                ei0: '$employee.ei0',
                ej0: '$employee.ej0',
                ek0: '$employee.ek0',
                el0: '$employee.el0',
                em0: '$employee.em0',
                eo0: '$employee.eo0',
                es0: '$employee.es0',
              },
            },
          },
        },
      ]);

      return p[0];
    }),
  },
  journalBalance: {
    type: JournalBalanceType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const j = journal(id);
      return j;
    }),
  },
};

const Mutation = {
  genXLSJournal: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const p = await journal(id);
      const s = await genXLS(p);
      return s;
    }),
  },
};

module.exports = { Query, Mutation };
