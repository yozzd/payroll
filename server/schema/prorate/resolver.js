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
