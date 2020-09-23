const { GraphQLList, GraphQLString, GraphQLError } = require('graphql');
const auth = require('../auth/service');
const User = require('./model');
const { UserType } = require('./type');

const Query = {
  users: {
    type: new GraphQLList(UserType),
    resolve: auth.isAuthenticated(async () => {
      try {
        const users = await User.find().sort('username');
        return users.filter((v) => v.role !== 'root');
      } catch (err) {
        throw new GraphQLError(err);
      }
    }),
  },
  me: {
    type: UserType,
    resolve: auth.isAuthenticated(async (_, args, ctx) => {
      try {
        const user = await User.findById(ctx.req.user.id);
        return user;
      } catch (err) {
        throw new GraphQLError(err);
      }
    }),
  },
};

const Mutation = {
  userCreate: {
    type: UserType,
    args: {
      username: { type: GraphQLString },
      password: { type: GraphQLString },
      role: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      try {
        const newUser = new User(args);
        const s = await newUser.save();
        return s;
      } catch (err) {
        throw new GraphQLError(err);
      }
    },
  },
};

module.exports = {
  Query,
  Mutation,
};
