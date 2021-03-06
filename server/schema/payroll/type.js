const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} = require('graphql');

const { DateFormat } = require('../scalar/date');
const { EmployeeType } = require('./employee.type');

const PayrollType = new GraphQLObjectType({
  name: 'PayrollType',
  fields: () => ({
    _id: { type: GraphQLString },
    from: { type: GraphQLString },
    to: { type: GraphQLString },
    year: { type: GraphQLInt },
    month: { type: GraphQLInt },
    period: { type: GraphQLString },
    dir: { type: GraphQLString },
    freeze: { type: GraphQLBoolean },
    typeHR: { type: GraphQLInt },
    tglHR: { type: DateFormat },
    employee: { type: new GraphQLList(EmployeeType) },
  }),
});

const GenType = new GraphQLObjectType({
  name: 'GenType',
  fields: () => ({
    sStatus: { type: GraphQLInt },
  }),
});

const SendType = new GraphQLObjectType({
  name: 'SendType',
  fields: () => ({
    accepted: { type: GraphQLList(GraphQLString) },
    rejected: { type: GraphQLList(GraphQLString) },
  }),
});

module.exports = { PayrollType, GenType, SendType };
