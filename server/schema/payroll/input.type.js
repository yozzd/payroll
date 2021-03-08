const {
  GraphQLInputObjectType,
  GraphQLString,
} = require('graphql');

const ClonePayrollInputType = new GraphQLInputObjectType({
  name: 'ClonePayrollInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    from: { type: GraphQLString },
    to: { type: GraphQLString },
  }),
});

module.exports = { ClonePayrollInputType };
