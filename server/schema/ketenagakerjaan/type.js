const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
} = require('graphql');

const { DateFormat } = require('../scalar/date');

const EmployeeKetenagakerjaanType = new GraphQLObjectType({
  name: 'EmployeeKetenagakerjaanType',
  fields: () => ({
    _id: { type: GraphQLString },
    d0: { type: GraphQLString },
    e0: { type: GraphQLString },
    o0: { type: DateFormat },
    z0: { type: GraphQLString },
    aa0: { type: GraphQLString },
    ay0: { type: GraphQLFloat },
    cb0: { type: GraphQLFloat },
    cc0: { type: GraphQLFloat },
    cd0: { type: GraphQLFloat },
    ce0: { type: GraphQLFloat },
    ci0: { type: GraphQLFloat },
    cj0: { type: GraphQLFloat },
    cm0: { type: GraphQLFloat },
    ck0: { type: GraphQLString },
  }),
});

const KetenagakerjaanType = new GraphQLObjectType({
  name: 'KetenagakerjaanType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: new GraphQLList(EmployeeKetenagakerjaanType) },
  }),
});

module.exports = { KetenagakerjaanType };
