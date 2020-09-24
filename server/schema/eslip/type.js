const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const EmployeeQType = new GraphQLObjectType({
  name: 'EmployeeQType',
  fields: () => ({
    _id: { type: GraphQLString },
    b0: { type: GraphQLString },
    c0: { type: GraphQLString },
    h0: { type: GraphQLString },
    slipPath: { type: GraphQLString },
  }),
});

const ESlipType = new GraphQLObjectType({
  name: 'ESlipType',
  fields: () => ({
    _id: { type: GraphQLString },
    from: { type: GraphQLString },
    to: { type: GraphQLString },
    year: { type: GraphQLInt },
    period: { type: GraphQLString },
    employee: { type: new GraphQLList(EmployeeQType) },
  }),
});

const SlipType = new GraphQLObjectType({
  name: 'SlipType',
  fields: () => ({
    sStatus: { type: GraphQLInt },
    slipPath: { type: GraphQLString },
  }),
});

const MailType = new GraphQLObjectType({
  name: 'MailType',
  fields: () => ({
    accepted: { type: GraphQLList(GraphQLString) },
    rejected: { type: GraphQLList(GraphQLString) },
  }),
});

module.exports = { ESlipType, SlipType, MailType };
