const {
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} = require('graphql');
const Payroll = require('../payroll/model.js');
const { JournalType } = require('./type');
const auth = require('../auth/service');

const Query = {
  journalCategory: {
    type: JournalType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('admin', async (_, { id }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee'},
        {
          $group: {
            _id: {
                id: '$_id',
                category: '$employee.category',
             },
            employee : {
              $push: {
                _id: '$employee._id',
                d0: '$employee.d0',
                e0: '$employee.e0',
                l0: '$employee.l0',
                u0: '$employee.u0',
                v0: '$employee.v0',
                w0: '$employee.w0',
                y0: '$employee.y0',
                cy0: '$employee.cy0',
              },
            },
          },
        },
        {
          $group: {
            _id: '$_id.id',
            employee : { $push: '$employee' },
          }
        },
        {
          $project: {
            employeeA: { $arrayElemAt: [ '$employee', 0 ] },
            employeeP: { $arrayElemAt: [ '$employee', 1 ] },
          },
        },
      ]);

      return p[0];
    }),
  },
};

module.exports = { Query };
