const {
  GraphQLInputObjectType,
  GraphQLString,
} = require('graphql');

const AddEmployeeInputType = new GraphQLInputObjectType({
  name: 'AddEmployeeInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    e0: { type: GraphQLString },
  }),
});

module.exports = { AddEmployeeInputType };
