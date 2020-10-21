const {
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} = require('graphql');
const Payroll = require('../payroll/model.js');
const { PayrollType } = require('../payroll/type');
const auth = require('../auth/service');

const Query = {
  journalProduction: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const payroll = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee'},
        { $match: { 'employee.category': 1 } },
        {
          $group: {
            _id: '$_id',
            employee: {
              $push: {
                _id: '$employee._id',
                d0: '$employee.d0',
                e0: '$employee.e0',
                u0: '$employee.u0',
                v0: '$employee.v0',
                y0: '$employee.y0',
              },
            },
          },
        },
      ]);

      return payroll[0];
    }),
  },
};

module.exports = { Query };
