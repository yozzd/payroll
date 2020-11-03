const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
} = require('graphql');

const { DateFormat } = require('../scalar/date');

const EmployeeTaxType = new GraphQLObjectType({
  name: 'EmployeeTaxType',
  fields: () => ({
    _id: { type: GraphQLString },
    d0: { type: GraphQLString },
    e0: { type: GraphQLString },
    i0: { type: DateFormat },
    l0: { type: GraphQLString },
    q0: { type: GraphQLString },
    u0: { type: GraphQLString },
    y0: { type: GraphQLString },
    ai0: { type: GraphQLFloat },
    bk0: { type: GraphQLFloat },
    bu0: { type: GraphQLFloat },
    cn0: { type: GraphQLFloat },
    cy0: { type: GraphQLFloat },
    cz0: { type: GraphQLFloat },
    da0: { type: GraphQLFloat },
    db0: { type: GraphQLFloat },
    df0: { type: GraphQLFloat },
    en0: { type: GraphQLFloat },
    eq0: { type: GraphQLFloat },
    er0: { type: GraphQLFloat },
    es0: { type: GraphQLFloat },
    gross: { type: GraphQLFloat },
    ttax: { type: GraphQLFloat },
  }),
});

const TaxType = new GraphQLObjectType({
  name: 'TaxType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: new GraphQLList(EmployeeTaxType) },
  }),
});

module.exports = { TaxType };
