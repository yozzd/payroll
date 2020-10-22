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
    ai0: { type: GraphQLFloat },
    bu0: { type: GraphQLFloat },
    bv0: { type: GraphQLFloat },
    bx0: { type: GraphQLFloat },
    cb0: { type: GraphQLFloat },
    cc0: { type: GraphQLFloat },
    cg0: { type: GraphQLFloat },
    cq0: { type: GraphQLFloat },
    cs0: { type: GraphQLFloat },
    cy0: { type: GraphQLFloat },
    df0: { type: GraphQLFloat },
    ef0: { type: GraphQLFloat },
    eg0: { type: GraphQLFloat },
    eh0: { type: GraphQLFloat },
    ei0: { type: GraphQLFloat },
    ej0: { type: GraphQLFloat },
    ek0: { type: GraphQLFloat },
    el0: { type: GraphQLFloat },
    em0: { type: GraphQLFloat },
    eo0: { type: GraphQLFloat },
    es0: { type: GraphQLFloat },
  }),
});

const JournalType = new GraphQLObjectType({
  name: 'JournalType',
  fields: () => ({
    _id: { type: GraphQLString },
    employeeA: { type: new GraphQLList(EmployeeJType) },
    employeeP: { type: new GraphQLList(EmployeeJType) },
  }),
});

module.exports = { JournalType };
