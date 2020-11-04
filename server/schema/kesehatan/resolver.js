const {
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} = require('graphql');
const Payroll = require('../payroll/model.js');
const { KesehatanType } = require('./type');
const auth = require('../auth/service');

const Query = {
  kesehatanReport: {
    type: KesehatanType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee'},
        {
          $group: {
            _id: '$_id',
            employee : {
              $push: {
                _id: '$employee._id',
                d0: '$employee.d0',
                e0: '$employee.e0',
                o0: '$employee.o0',
                z0: '$employee.z0',
                aa0: '$employee.aa0',
                co0: '$employee.co0',
                cq0: '$employee.cq0',
                cr0: '$employee.cr0',
                cs0: '$employee.cs0',
                ct0: '$employee.ct0',
                cu0: '$employee.cu0',
              },
            },
          },
        },
      ]);

      return p[0];
    }),
  },
};

module.exports = { Query };
