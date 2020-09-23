const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const Auth = require('./auth/resolver');
const User = require('./user/resolver');

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...Auth.Query,
    ...User.Query,
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...User.Mutation,
  },
});

module.exports = new GraphQLSchema({
  query,
  mutation,
});
