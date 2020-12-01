const fs = require('fs-extra');
const {
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} = require('graphql');
const Thr = require('./model.js');
const { ThrType } = require('./type');
const { GenType, SendType } = require('../payroll/type');
const auth = require('../auth/service');
const { generateThr, sendThr } = require('./method');

const Query = {
  thrs: {
    type: new GraphQLList(ThrType),
    args: {
      year: { type: GraphQLInt },
    },
    resolve: auth.hasRole('admin', async (_, { year }) => {
      const thr = await Thr.find({ year }).sort('-month');
      return thr;
    }),
  },
  employeeThr: {
    type: ThrType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const thr = await Thr.aggregate([
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
      return thr[0];
    }),
  },
};

const Mutation = {
  thrDelete: {
    type: ThrType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const e = await Thr.findOne({ _id: id });
      await fs.remove(`static/thr/${e.dir}`);
      await Thr.findOneAndDelete({ _id: id });
      return { _id: id };
    }),
  },
  generateThr: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
      eId: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id, eId }) => {
      const p = await Thr.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        { $match: { 'employee._id': eId } },
      ]);
      const s = await generateThr(p[0]);
      return s;
    }),
  },
  sendThr: {
    type: SendType,
    args: {
      id: { type: GraphQLString },
      eId: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id, eId }) => {
      const p = await Thr.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        { $match: { 'employee._id': eId } },
      ]);
      const s = await sendThr(p[0]);
      return s;
    }),
  },
};

module.exports = {
  Query,
  Mutation,
};
