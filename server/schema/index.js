const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const Auth = require('./auth/resolver');
const ESlip = require('./eslip/resolver');
const Import = require('./import/resolver');
const Journal = require('./journal/resolver');
const Ketenagakerjaan = require('./ketenagakerjaan/resolver');
const Kesehatan = require('./kesehatan/resolver');
const Payroll = require('./payroll/resolver');
const Prorate = require('./prorate/resolver');
const Tax = require('./tax/resolver');
const Thr = require('./thr/resolver');
const Trf = require('./trf/resolver');
const User = require('./user/resolver');

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...Auth.Query,
    ...ESlip.Query,
    ...Journal.Query,
    ...Ketenagakerjaan.Query,
    ...Kesehatan.Query,
    ...Payroll.Query,
    ...Prorate.Query,
    ...Tax.Query,
    ...Thr.Query,
    ...Trf.Query,
    ...User.Query,
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...ESlip.Mutation,
    ...Import.Mutation,
    ...Ketenagakerjaan.Mutation,
    ...Kesehatan.Mutation,
    ...Payroll.Mutation,
    ...Prorate.Mutation,
    ...Tax.Mutation,
    ...Thr.Mutation,
    ...Trf.Mutation,
    ...User.Mutation,
  },
});

module.exports = new GraphQLSchema({
  query,
  mutation,
});
