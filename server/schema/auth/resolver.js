const { GraphQLString, GraphQLError } = require('graphql');
const passport = require('passport');
const { signToken } = require('./service');
const AuthType = require('./type');

const authLocal = (req, res) => new Promise((resolve, reject) => {
  passport.authenticate('local', async (err, user, info) => {
    const error = err || info;
    if (error) {
      reject(new GraphQLError(error.message));
    }
    if (!user) {
      reject(new GraphQLError('Something went wrong, please try again'));
    }
    const { id, username, role } = user;
    const token = await signToken(id, username, role);
    resolve({ id, token });
  })(req, res);
});

const Query = {
  auth: {
    type: AuthType,
    args: {
      username: { type: GraphQLString },
      password: { type: GraphQLString },
    },
    resolve: async (_, { username, password }, ctx) => {
      ctx.req.body = { username, password };
      const a = await authLocal(ctx.req, ctx.res);
      return a;
    },
  },
};

module.exports = { Query };
