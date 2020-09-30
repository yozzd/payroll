const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const PayrollType = new GraphQLObjectType({
  name: 'PayrollType',
  fields: () => ({
    _id: { type: GraphQLString },
    from: { type: GraphQLString },
    to: { type: GraphQLString },
    year: { type: GraphQLInt },
    period: { type: GraphQLString },
  }),
});

module.exports = { PayrollType };
