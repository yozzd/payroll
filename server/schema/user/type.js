const { GraphQLObjectType, GraphQLString } = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    _id: { type: GraphQLString },
    username: { type: GraphQLString },
    role: { type: GraphQLString },
  }),
});

module.exports = {
  UserType,
};
