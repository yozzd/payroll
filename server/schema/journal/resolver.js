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
                ai0: '$employee.ai0',
                bu0: '$employee.bu0',
                bv0: '$employee.bv0',
                bx0: '$employee.bx0',
                cb0: '$employee.cb0',
                cc0: '$employee.cc0',
                cg0: '$employee.cg0',
                cq0: '$employee.cq0',
                cs0: '$employee.cs0',
                cy0: '$employee.cy0',
                df0: '$employee.df0',
                ef0: '$employee.ef0',
                eg0: '$employee.eg0',
                eh0: '$employee.eh0',
                ei0: '$employee.ei0',
                ej0: '$employee.ej0',
                ek0: '$employee.ek0',
                el0: '$employee.el0',
                em0: '$employee.em0',
                eo0: '$employee.eo0',
                es0: '$employee.es0',
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
