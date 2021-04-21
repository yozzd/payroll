// rename this to index.js

const mongoose = require('mongoose');
const consola = require('consola');

const config = {
  userRoles: ['guest', 'user', 'admin'],
  secret: { session: 'my-secret-session' },
  xlsPass: 'xlspassword',
  mongo: {
    connect: async () => {
      try {
        await mongoose.connect('mongodb://127.0.0.1/payroll', {
          useCreateIndex: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serializeFunctions: true,
        });
      } catch (err) {
        consola.error(`MongoDB connection error: ${err}`);
        process.exit(-1);
      }
    },
    close: async () => {
      await mongoose.connection.close();
    },
  },
};

module.exports = config;
