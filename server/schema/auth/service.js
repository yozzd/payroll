const jw = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { GraphQLError } = require('graphql');
const { secret, userRoles } = require('../../config');

const validateJwt = expressJwt({
  secret: secret.session,
  credentialsRequired: false,
  algorithms: ['HS256'],
});

exports.signToken = (id, username, role) => jw.sign({ id, username, role }, secret.session, { expiresIn: '15h' });

exports.validateAuthorization = async (req, res, next) => {
  if (req.headers.authorization) {
    const v = await validateJwt(req, res, next);
    return v;
  }
  return next();
};

exports.isAuthenticated = (fn) => async (_, args, ctx) => {
  if (!ctx.req.user) {
    throw new GraphQLError('Access Denied / Forbidden');
  } else {
    if (userRoles.indexOf(ctx.req.user.role)) {
      const u = await fn(...[_, args, ctx]);
      return u;
    }
    throw new GraphQLError('Access Denied / Forbidden');
  }
};

exports.hasRole = (role, fn) => async (_, args, ctx) => {
  if (!ctx.req.user) {
    throw new GraphQLError('Access Denied / Forbidden');
  } else {
    if (userRoles.indexOf(ctx.req.user.role) >= userRoles.indexOf(role)) {
      const u = await fn(...[_, args, ctx]);
      return u;
    }
    throw new GraphQLError('Access Denied / Forbidden');
  }
};
