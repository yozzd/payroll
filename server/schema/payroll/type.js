const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const EmployeeType = new GraphQLObjectType({
  name: 'EmployeeType',
  fields: () => ({
    _id: { type: GraphQLString },
    d0: { type: GraphQLString },
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
