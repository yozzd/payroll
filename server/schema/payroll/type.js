const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const { DateFormat } = require('../scalar/date');
const { IntPre0, FloatPre2, FloatPre4 } = require('../scalar/number');

const EmployeeType = new GraphQLObjectType({
  name: 'EmployeeType',
  fields: () => ({
    _id: { type: GraphQLString },
    d0: { type: GraphQLString },
    e0: { type: GraphQLString },
    g0: { type: GraphQLInt },
    h0: { type: GraphQLString },
    i0: { type: DateFormat },
    j0: { type: GraphQLInt },
    k0: { type: DateFormat },
    l0: { type: IntPre0 },
    m0: { type: GraphQLString },
    n0: { type: GraphQLString },
    o0: { type: DateFormat },
    p0: { type: GraphQLString },
    q0: { type: GraphQLString },
    r0: { type: GraphQLString },
    s0: { type: GraphQLString },
    t0: { type: GraphQLString },
    u0: { type: GraphQLString },
    v0: { type: GraphQLString },
    w0: { type: GraphQLString },
    x0: { type: GraphQLString },
    y0: { type: GraphQLString },
    z0: { type: GraphQLString },
    aa0: { type: GraphQLString },
  }),
});

const PayrollType = new GraphQLObjectType({
  name: 'PayrollType',
  fields: () => ({
    _id: { type: GraphQLString },
    from: { type: GraphQLString },
    to: { type: GraphQLString },
    year: { type: GraphQLInt },
    period: { type: GraphQLString },
    employee: { type: new GraphQLList(EmployeeType) },
  }),
});

module.exports = { PayrollType };
