const { GraphQLString } = require('graphql');
const Payroll = require('../payroll/model');
const { PayrollType } = require('../payroll/type');
const auth = require('../auth/service');

const Query = {
  trfReport: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        { $match: { 'employee.ex0': false } },
        {
          $group: {
            _id: '$_id',
            period: { $first: '$period' },
            year: { $first: '$year' },
            employee: {
              $push: {
                _id: '$employee._id',
                d0: '$employee.d0',
                e0: '$employee.e0',
                s0: '$employee.s0',
                t0: '$employee.t0',
                ec0: '$employee.ec0',
                ec0F: {
                  $function: {
                    body: `function(v) {
                      return Math.floor(v / 100) * 100;
                    }`,
                    args: ['$employee.ec0'],
                    lang: 'js',
                  },
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

module.exports = { Query };
