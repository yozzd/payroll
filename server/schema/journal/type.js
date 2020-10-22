const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql');

const fs = require('fs-extra');
const { DateFormat } = require('../scalar/date');

const EmployeeJType = new GraphQLObjectType({
  name: 'EmployeeJType',
  fields: () => ({
    _id: { type: GraphQLString },
    d0: { type: GraphQLString },
    e0: { type: GraphQLString },
    l0: { type: GraphQLFloat },
    u0: { type: GraphQLString },
    v0: { type: GraphQLString },
    w0: { type: GraphQLString },
    y0: { type: GraphQLString },
    cy0: { type: GraphQLFloat },
  }),
});

const JournalType = new GraphQLObjectType({
  name: 'JournalType',
  fields: () => ({
    _id: { type: GraphQLString },
    employeeP: { type: new GraphQLList(EmployeeJType) },
    employeeA: { type: new GraphQLList(EmployeeJType) },
  }),
});

module.exports = { JournalType };
