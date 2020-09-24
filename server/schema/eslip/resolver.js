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
  autoGenerate: {
    type: SlipType,
    resolve: async () => {
      const eslip = await ESlip.findOne({ done: 0 });
      const l = eslip.employee.length;
      const d = 50;
      const r = l % d;
      const m = (l - r) / d;
      // const t = 3600000;
      const t = 60000;

      let p = [];
      const seq = async (k) => {
        try {
          await Promise.all(
            k.map(async (v) => {
              if (v.h0) {
                await generateESlip(eslip, v);
              }
            }),
          );
          await eslip.save();
          return 'Done';
        } catch(err) {
          console.log(err);
        }
      }

      for (let i = 0; i <= m; i += 1) {
        let s = i * d;
        let e = 0;
        if (i === m) {
          e = l;
        } else {
          e = (i * d) + d;
        }

        setTimeout(() => {
          console.log(`Start ${i}: ${format(Date.now(), 'HH:mm:ss')}`);
          p.push(seq(eslip.employee.slice(s, e)));
        }, t * i, i);
      }
      await Promise.all(p);
      return { sStatus: 1 };
    },
  },
};

module.exports = {
  Query,
  Mutation,
};
