const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
} = require('graphql');

const fs = require('fs-extra');
const { DateFormat } = require('../scalar/date');

const EmpSummaryType = new GraphQLObjectType({
  name: 'EmpSummaryType',
  fields: () => ({
    _id: { type: GraphQLString },
    d0: { type: GraphQLString },
    e0: { type: GraphQLString },
    i0: { type: DateFormat },
    u0: { type: GraphQLString },
    y0: { type: GraphQLString },
    jan: { type: GraphQLFloat },
    feb: { type: GraphQLFloat },
    mar: { type: GraphQLFloat },
    apr: { type: GraphQLFloat },
    mei: { type: GraphQLFloat },
    jun: { type: GraphQLFloat },
    jul: { type: GraphQLFloat },
    agu: { type: GraphQLFloat },
    sep: { type: GraphQLFloat },
    okt: { type: GraphQLFloat },
    nov: { type: GraphQLFloat },
    des: { type: GraphQLFloat },
    totM: { type: GraphQLFloat },
  }),
});

const SummaryType = new GraphQLObjectType({
  name: 'SummaryType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: new GraphQLList(EmpSummaryType) },
  }),
});

module.exports = { SummaryType };
