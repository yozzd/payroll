const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { graphqlUploadExpress } = require('graphql-upload');
const cors = require('cors');
const passport = require('passport');
const consola = require('consola');

const app = express();

const { mongo } = require('./config');
const schema = require('./schema');
const authPassport = require('./schema/auth/passport');
const User = require('./schema/user/model');
const auth = require('./schema/auth/service');

const host = '0.0.0.0';
const port = 3001;

app.use(cors());
authPassport.setup(User);

app.use(
  '/graphql',
  auth.validateAuthorization,
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  graphqlHTTP((req, res, params) => ({
    schema,
    context: { req, res, params },
    graphiql: 'true',
  })),
);

app.use(passport.initialize());

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(err.status).send({ message: err.message });
    return;
  }
  next();
});

async function start() {
  await mongo.connect();
  app.listen(port, host);

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
}

start();
