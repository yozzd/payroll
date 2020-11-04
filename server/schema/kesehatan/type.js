const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
} = require('graphql');

const { DateFormat } = require('../scalar/date');

const EmployeeKesehatanType = new GraphQLObjectType({
  name: 'EmployeeKesehatanType',
  fields: () => ({
    _id: { type: GraphQLString },
    d0: { type: GraphQLString },
    e0: { type: GraphQLString },
    o0: { type: DateFormat },
    z0: { type: GraphQLString },
    aa0: { type: GraphQLString },
    co0: { type: GraphQLFloat },
    cq0: { type: GraphQLFloat },
    cr0: { type: GraphQLFloat },
    cs0: { type: GraphQLFloat },
    ct0: { type: GraphQLString },
    cu0: { type: GraphQLFloat },
  }),
});

const KesehatanType = new GraphQLObjectType({
  name: 'KesehatanType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: new GraphQLList(EmployeeKesehatanType) },
  }),
});

module.exports = { KesehatanType };
