const {
  GraphQLInputObjectType,
  GraphQLString,
} = require('graphql');

const CloneInputType = new GraphQLInputObjectType({
  name: 'CloneInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    from: { type: GraphQLString },
    to: { type: GraphQLString },
  }),
});

module.exports = { CloneInputType };
