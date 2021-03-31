const fs = require('fs-extra');
const {
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} = require('graphql');
const Payroll = require('../payroll/model');
const Prorate = require('./model.js');
const { ProrateType } = require('./type');
const { PayrollType, GenType, SendType } = require('../payroll/type');
const auth = require('../auth/service');
const { generateProrate, sendProrate } = require('./method');

const Query = {
  prorate: {
    type: new GraphQLList(ProrateType),
    args: {
      year: { type: GraphQLInt },
    },
    resolve: auth.hasRole('user', async (_, { year }) => {
      const prorate = await Prorate.find({ year }).sort('-month');
      return prorate;
    }),
  },
  employeeProrate: {
    type: ProrateType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const prorate = await Prorate.aggregate([
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
      return prorate[0];
    }),
  },
  prorateReport: {
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
                tprorate: {
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
  prorateDelete: {
    type: ProrateType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const e = await Prorate.findOne({ _id: id });
      await fs.remove(`static/prorate/${e.dir}`);
      await Prorate.findOneAndDelete({ _id: id });
      return { _id: id };
    }),
  },
  generateProrate: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
      eId: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id, eId }) => {
      const p = await Prorate.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        { $match: { 'employee._id': eId } },
      ]);
      const s = await generateProrate(p[0]);
      return s;
    }),
  },
  sendProrate: {
    type: SendType,
    args: {
      id: { type: GraphQLString },
      eId: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id, eId }) => {
      const p = await Prorate.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        { $match: { 'employee._id': eId } },
      ]);
      const s = await sendProrate(p[0]);
      return s;
    }),
  },
};

module.exports = {
  Query,
  Mutation,
};
