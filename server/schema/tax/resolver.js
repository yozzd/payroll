const fs = require('fs-extra');
const {
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} = require('graphql');
const Payroll = require('../payroll/model');
const Tax = require('./model.js');
const { TaxType } = require('./type');
const { PayrollType, GenType, SendType } = require('../payroll/type');
const auth = require('../auth/service');
const { generateTax, sendTax } = require('./method');

const Query = {
  tax: {
    type: new GraphQLList(TaxType),
    args: {
      year: { type: GraphQLInt },
    },
    resolve: auth.hasRole('user', async (_, { year }) => {
      const tax = await Tax.find({ year }).sort('-month');
      return tax;
    }),
  },
  employeeTax: {
    type: TaxType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const tax = await Tax.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        {
          $group: {
            _id: '$_id',
            period: { $first: '$period' },
            year: { $first: '$year' },
            employee: {
              $push: {
                _id: '$employee._id',
                b0: '$employee.b0',
                c0: '$employee.c0',
                e0: '$employee.e0',
                slip: {
                  name: '$employee.slip.name',
                  dir: '$dir',
                },
              },
            },
          },
        },
      ]);
      return tax[0];
    }),
  },
  taxReport: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        {
          $group: {
            _id: '$_id',
            employee: {
              $push: {
                _id: '$employee._id',
                d0: '$employee.d0',
                e0: '$employee.e0',
                i0: '$employee.i0',
                l0: '$employee.l0',
                q0: '$employee.q0',
                u0: '$employee.u0',
                y0: '$employee.y0',
                ai0: '$employee.ai0',
                bk0: '$employee.bk0',
                bu0: '$employee.bu0',
                cn0: '$employee.cn0',
                cy0: '$employee.cy0',
                cz0: '$employee.cz0',
                da0: '$employee.da0',
                db0: '$employee.db0',
                df0: '$employee.df0',
                en0: '$employee.en0',
                eq0: '$employee.eq0',
                er0: '$employee.er0',
                es0: '$employee.es0',
                gross: {
                  $subtract: [
                    {
                      $sum: [
                        '$employee.l0', '$employee.ai0', '$employee.bk0',
                        '$employee.cn0', '$employee.bu0', '$employee.en0',
                        '$employee.eq0',
                      ],
                    },
                    { $sum: ['$employee.cy0', '$employee.df0'] },
                  ],
                },
                ttax: {
                  $subtract: ['$employee.db0', '$employee.es0'],
                },
              },
            },
          },
        },
      ]);

      return p[0];
    }),
  },
};

const Mutation = {
  taxDelete: {
    type: TaxType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const e = await Tax.findOne({ _id: id });
      await fs.remove(`static/tax/${e.dir}`);
      await Tax.findOneAndDelete({ _id: id });
      return { _id: id };
    }),
  },
  generateTax: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
      eId: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id, eId }) => {
      const p = await Tax.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        { $match: { 'employee._id': eId } },
      ]);
      const s = await generateTax(p[0]);
      return s;
    }),
  },
  sendTax: {
    type: SendType,
    args: {
      id: { type: GraphQLString },
      eId: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id, eId }) => {
      const p = await Tax.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        { $match: { 'employee._id': eId } },
      ]);
      const s = await sendTax(p[0]);
      return s;
    }),
  },
};

module.exports = {
  Query,
  Mutation,
};
