const { GraphQLString } = require('graphql');
const Payroll = require('../payroll/model');
const { PayrollType } = require('../payroll/type');
const auth = require('../auth/service');

const Query = {
  ketenagakerjaanReport: {
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
                o0: '$employee.o0',
                z0: '$employee.z0',
                aa0: '$employee.aa0',
                ay0: '$employee.ay0',
                cb0: '$employee.cb0',
                cc0: '$employee.cc0',
                cd0: '$employee.cd0',
                ce0: '$employee.ce0',
                ci0: '$employee.ci0',
                cj0: '$employee.cj0',
                cm0: '$employee.cm0',
                ck0: '$employee.ck0',
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
