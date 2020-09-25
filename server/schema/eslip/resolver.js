const fs = require('fs-extra');
const { format } = require('date-fns');
const {
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} = require('graphql');
const ESlip = require('./model.js');
const { ESlipType, SlipType, MailType } = require('./type');
const auth = require('../auth/service');
const { generateESlip, sendESlip } = require('./method');

const Query = {
  eslips: {
    type: new GraphQLList(ESlipType),
    args: {
      year: { type: GraphQLInt },
    },
    resolve: auth.hasRole('admin', async (_, { year }) => {
      const eslip = await ESlip.find({ year });
      return eslip;
    }),
  },
  employeeESlip: {
    type: ESlipType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const eslip = await ESlip.findOne({ _id: id });
      return eslip;
    }),
  },
};

const Mutation = {
  eslipDelete: {
    type: ESlipType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const e = await ESlip.findOne({ _id: id }).select('from');
      const dir = format(new Date(e.from), 'yyyyMM');
      await fs.remove(`static/eslip/${dir}`);
      await ESlip.findOneAndDelete({ _id: id });
      return { _id: id };
    }),
  },
  generateESlip: {
    type: SlipType,
    args: {
      id: { type: GraphQLString },
      eId: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id, eId }) => {
      const eslip = await ESlip.findOne({ _id: id });
      const e = eslip.employee.id(eId);
      const s = await generateESlip(eslip, e);
      await eslip.save();
      return s;
    }),
  },
  sendESlip: {
    type: MailType,
    args: {
      id: { type: GraphQLString },
      eId: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id, eId }) => {
      const eslip = await ESlip.findOne({ _id: id });
      const e = eslip.employee.id(eId);
      const s = await sendESlip(eslip, e);
      return s;
    }),
  },
};

module.exports = {
  Query,
  Mutation,
};
