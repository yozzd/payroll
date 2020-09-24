const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const Auth = require('./auth/resolver');
const ESlip = require('./eslip/resolver');
const Import = require('./import/resolver');
const User = require('./user/resolver');

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...Auth.Query,
    ...ESlip.Query,
    ...User.Query,
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...ESlip.Mutation,
    ...Import.Mutation,
    ...User.Mutation,
  },
});

module.exports = new GraphQLSchema({
  query,
  mutation,
});
