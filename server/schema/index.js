const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const Auth = require('./auth/resolver');
const ESlip = require('./eslip/resolver');
const Import = require('./import/resolver');
const Journal = require('./journal/resolver');
const Ketenagakerjaan = require('./ketenagakerjaan/resolver');
const Kesehatan = require('./kesehatan/resolver');
const Payroll = require('./payroll/resolver');
const Percentage = require('./percentage/resolver');
const Pph = require('./pph/resolver');
const Prorate = require('./prorate/resolver');
const Summary = require('./summary/resolver');
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
    ...Percentage.Query,
    ...Pph.Query,
    ...Prorate.Query,
    ...Summary.Query,
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
    ...Journal.Mutation,
    ...Ketenagakerjaan.Mutation,
    ...Kesehatan.Mutation,
    ...Payroll.Mutation,
    ...Percentage.Mutation,
    ...Pph.Mutation,
    ...Prorate.Mutation,
    ...Summary.Mutation,
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
