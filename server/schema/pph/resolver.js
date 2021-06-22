const { GraphQLString } = require('graphql');
const Payroll = require('../payroll/model');
const { PayrollType, GenType } = require('../payroll/type');
const auth = require('../auth/service');
const { genPDF } = require('./method');

const Query = {
  pphReport: {
    type: PayrollType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: auth.hasRole('guest', async (_, { id }) => {
      const payroll = await Payroll.aggregate([
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
                d0: '$employee.d0',
                e0: '$employee.e0',
                ex0: '$employee.ex0',
                pph: {
                  name: '$employee.slip.name',
                  dir: '$dir',
                },
              },
            },
          },
        },
      ]);

      return payroll[0];
    }),
  },
};

const Mutation = {
  genPph: {
    type: GenType,
    args: {
      id: { type: GraphQLString },
      eId: { type: GraphQLString },
    },
    resolve: auth.hasRole('user', async (_, { id, eId }) => {
      const p = await Payroll.aggregate([
        { $match: { _id: id } },
        { $unwind: '$employee' },
        { $match: { 'employee._id': eId } },
        {
          $project: {
            _id: '$_id',
            dir: '$dir',
            to: '$to',
            rate: '$rate',
            eId: '$employee._id',
            d0: '$employee.d0',
            e0: '$employee.e0',
            l0: '$employee.l0',
            p0: '$employee.p0',
            r0: '$employee.r0',
            ai0: '$employee.ai0',
            bk0: '$employee.bk0',
            bu0: '$employee.bu0',
            bx0: '$employee.bx0',
            bz0: '$employee.bz0',
            cb0: '$employee.cb0',
            cc0: '$employee.cc0',
            ce0: '$employee.ce0',
            cj0: '$employee.cj0',
            cq0: '$employee.cq0',
            cy0: '$employee.cy0',
            df0: '$employee.df0',
            dr0: '$employee.dr0',
            ea0: '$employee.ea0',
            fc0: '$employee.fc0',
            pph: {
              name: '$employee.slip.name',
            },
          },
        },
        {
          $addFields: {
            ai0b: { $multiply: ['$ai0', '$ea0'] },
            bk0b: { $multiply: ['$bk0', '$ea0'] },
            bu0b: { $multiply: ['$bu0', '$ea0'] },
            cb0b: { $multiply: ['$cb0', '$ea0'] },
            cc0b: { $multiply: ['$cc0', '$ea0'] },
            ce0b: { $multiply: ['$ce0', '$ea0'] },
            cj0b: { $multiply: ['$cj0', '$ea0'] },
            cq0b: { $multiply: ['$cq0', '$ea0'] },
            cy0b: { $multiply: ['$cy0', '$ea0'] },
            t0b: { $multiply: ['$l0', '$ea0'] },
            t1a: { $subtract: [{ $sum: ['$l0', '$bk0', '$ai0', '$cb0', '$cc0', '$cq0', '$bu0', '$dr0', '$bz0', 'bx0'] }, { $sum: ['$df0', '$cy0'] }] },
          },
        },
        {
          $addFields: {
            t1b: { $subtract: [{ $sum: ['$t0b', '$bk0b', '$ai0b', '$cb0b', '$cc0b', '$cq0b', '$bu0b', '$dr0', '$bz0', '$bx0'] }, { $sum: ['$df0', '$cy0b'] }] },
            t1c: { $subtract: [{ $sum: ['$t0b', '$bk0b', '$ai0b', '$cb0b', '$cc0b', '$cq0b', '$bu0b'] }, { $sum: ['$df0b', '$cy0b'] }] },
            t2a: {
              $function: {
                body: `function(v) {
                  return (v * 0.05 >= 500000) ? 500000 : Math.round(v * 0.05);
                }`,
                args: ['$t1a'],
                lang: 'js',
              },
            },
          },
        },
        {
          $addFields: {
            t2b: {
              $function: {
                body: `function(v) {
                  return (v * 0.05 >= 6000000) ? 6000000 : Math.round(v * 0.05);
                }`,
                args: ['$t1b'],
                lang: 'js',
              },
            },
            t2c: {
              $function: {
                body: `function(v) {
                  return (v * 0.05 >= 6000000) ? 6000000 : Math.round(v * 0.05);
                }`,
                args: ['$t1c'],
                lang: 'js',
              },
            },
            t3a: { $sum: ['$t2a', '$ce0', '$cj0'] },
          },
        },
        {
          $addFields: {
            t3b: { $sum: ['$t2b', '$ce0b', '$cj0b'] },
            t3c: { $sum: ['$t2c', '$ce0b', '$cj0b'] },
            t4a: { $subtract: ['$t1a', '$t3a'] },
          },
        },
        {
          $addFields: {
            t4b: { $subtract: ['$t1b', '$t3b'] },
            t4c: { $subtract: ['$t1c', '$t3c'] },
            t5a: { $multiply: ['$t4a', '$ea0'] },
          },
        },
        {
          $addFields: {
            t6a: {
              $function: {
                body: `function(v, r) {
                  const ptkpObject = {
                    'TK/0': r.b4,
                    'TK/1': r.b5,
                    'TK/2': r.b6,
                    'TK/3': r.b7,
                    'K/0': r.b8,
                    'K/1': r.b9,
                    'K/2': r.b10,
                    'K/3': r.b11,
                  };
                  return ptkpObject[v];
                }`,
                args: ['$r0', '$rate'],
                lang: 'js',
              },
            },
          },
        },
        {
          $addFields: {
            t7a: { $subtract: ['$t5a', '$t6a'] },
            t7b: { $subtract: ['$t4b', '$t6a'] },
            t7c: { $subtract: ['$t4c', '$t6a'] },
          },
        },
        {
          $addFields: {
            t8a: {
              $function: {
                body: `function(v) {
                  return (v <= 0 ? 0 : Math.floor(v / 1000) * 1000);
                }`,
                args: ['$t7a'],
                lang: 'js',
              },
            },
          },
        },
        {
          $addFields: {
            t8b: {
              $function: {
                body: `function(v) {
                  return (v <= 0 ? 0 : Math.floor(v / 1000) * 1000);
                }`,
                args: ['$t7b'],
                lang: 'js',
              },
            },
            t8c: {
              $function: {
                body: `function(v) {
                  return (v <= 0 ? 0 : Math.floor(v / 1000) * 1000);
                }`,
                args: ['$t7c'],
                lang: 'js',
              },
            },
            t9a: {
              $function: {
                body: `function(v) {
                  const pph = Math.min(Math.max(0, v), 50000000) * 0.05 + Math.min(Math.max(0, v - 50000000), 200000000) * 0.15 + Math.min(Math.max(0, v - 250000000), 250000000) * 0.25 + Math.max(0, v - 500000000) * 0.3;
                  return pph;
                }`,
                args: ['$t8a'],
                lang: 'js',
              },
            },
          },
        },
        {
          $addFields: {
            t9b: {
              $function: {
                body: `function(v) {
                  const pph = Math.min(Math.max(0, v), 50000000) * 0.05 + Math.min(Math.max(0, v - 50000000), 200000000) * 0.15 + Math.min(Math.max(0, v - 250000000), 250000000) * 0.25 + Math.max(0, v - 500000000) * 0.3;
                  return pph;
                }`,
                args: ['$t8b'],
                lang: 'js',
              },
            },
            t9c: {
              $function: {
                body: `function(v) {
                  const pph = Math.min(Math.max(0, v), 50000000) * 0.05 + Math.min(Math.max(0, v - 50000000), 200000000) * 0.15 + Math.min(Math.max(0, v - 250000000), 250000000) * 0.25 + Math.max(0, v - 500000000) * 0.3;
                  return pph;
                }`,
                args: ['$t8c'],
                lang: 'js',
              },
            },
            t10a: {
              $function: {
                body: `function(v, e) {
                  return (v === 0 ? 0 : Math.round(v / e));
                }`,
                args: ['$t9a', '$ea0'],
                lang: 'js',
              },
            },
          },
        },
        {
          $addFields: {
            t10b: {
              $function: {
                body: `function(v) {
                  return (v === 0 ? 0 : Math.round(v));
                }`,
                args: ['$t9b'],
                lang: 'js',
              },
            },
            t10c: {
              $function: {
                body: `function(v) {
                  return (v === 0 ? 0 : Math.round(v));
                }`,
                args: ['$t9c'],
                lang: 'js',
              },
            },
            t11a: {
              $function: {
                body: `function(a, b, c) {
                  if (a) {
                    return a;
                  } if (!a && b === 'Yes') {
                    const v = Math.floor(c / 100) * 100;
                    return (v <= 200 ? 0 : v);
                  }
                  return (Math.floor((c * 1.2) / 100) * 100);
                }`,
                args: ['$fc0', '$p0', '$t10a'],
                lang: 'js',
              },
            },
            t12b: { $subtract: ['$t9b', '$t9c'] },
          },
        },
        {
          $addFields: {
            t11b: {
              $function: {
                body: `function(a, b, c) {
                  if (a) {
                    return a;
                  } if (!a && b === 'Yes') {
                    const v = Math.floor(c / 100) * 100;
                    return (v <= 200 ? 0 : v);
                  }
                  return (Math.floor((c * 1.2) / 100) * 100);
                }`,
                args: ['$fc0', '$p0', '$t10b'],
                lang: 'js',
              },
            },
            t11c: {
              $function: {
                body: `function(a, b, c) {
                  if (a) {
                    return a;
                  } if (!a && b === 'Yes') {
                    const v = Math.floor(c / 100) * 100;
                    return (v <= 200 ? 0 : v);
                  }
                  return (Math.floor((c * 1.2) / 100) * 100);
                }`,
                args: ['$fc0', '$p0', '$t10c'],
                lang: 'js',
              },
            },
          },
        },
      ]);

      const s = await genPDF(p[0]);
      return s;
    }),
  },
};

module.exports = { Query, Mutation };
