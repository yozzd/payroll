const {
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} = require('graphql');
const Payroll = require('../payroll/model');
const { PayrollType } = require('../payroll/type');
const auth = require('../auth/service');

const Query = {
  taxReport: {
    type: PayrollType,
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
                      ]
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

module.exports = { Query };
