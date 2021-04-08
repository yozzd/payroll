const { GraphQLList, GraphQLString, GraphQLError } = require('graphql');
const auth = require('../auth/service');
const User = require('./model');
const { UserType } = require('./type');
const { DeleteInputType } = require('../payroll/input.type');

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
    resolve: auth.hasRole('root', async (_, args) => {
      try {
        const newUser = new User(args);
        const s = await newUser.save();
        return s;
      } catch (err) {
        throw new GraphQLError(err);
      }
    }),
  },
  userChangePassword: {
    type: UserType,
    args: {
      id: { type: GraphQLString },
      oldPassword: { type: GraphQLString },
      newPassword: { type: GraphQLString },
    },
    resolve: auth.isAuthenticated(async (_, { id, oldPassword, newPassword}) => {
      const user = await User.findById(id);
      const c = await user.authenticate(oldPassword);
      if (c) {
        user.password = newPassword;
        return await user.save();
      }
      throw new GraphQLError('Your password in invalid, please try again');
    }),
  },
  userDelete: {
    type: new GraphQLList(UserType),
    args: {
      del: { type: new GraphQLList(DeleteInputType) },
    },
    resolve: auth.hasRole('user', async (_, { del }) => {
      await Promise.all(
        del.map(async (v) => {
          await User.findOneAndDelete({ _id: v._id });
        }),
      );
      return del;
    }),
  },
};

module.exports = {
  Query,
  Mutation,
};
