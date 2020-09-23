const { GraphQLObjectType, GraphQLString } = require('graphql');

const Auth = new GraphQLObjectType({
  name: 'Auth',
  fields: () => ({
    _id: { type: GraphQLString },
    token: { type: GraphQLString },
  }),
});

module.exports = Auth;
