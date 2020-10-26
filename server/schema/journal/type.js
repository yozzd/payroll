const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql');

const fs = require('fs-extra');
const { DateFormat } = require('../scalar/date');

const JournalEmpType = new GraphQLObjectType({
  name: 'JournalEmpType',
  fields: () => ({
		category: { type: GraphQLInt},
		salary: { type: GraphQLFloat },
		retro: { type: GraphQLFloat },
		ot: { type: GraphQLFloat },
		accident: { type: GraphQLFloat },
		death: { type: GraphQLFloat },
		medical: { type: GraphQLFloat },
		pension: { type: GraphQLFloat },
		posfunc: { type: GraphQLFloat },
		housing: { type: GraphQLFloat },
		transport: { type: GraphQLFloat },
		incentive: { type: GraphQLFloat },
		meals: { type: GraphQLFloat },
		living: { type: GraphQLFloat },
		communication: { type: GraphQLFloat },
		other: { type: GraphQLFloat },
		thr: { type: GraphQLFloat },
		taxReturn: { type: GraphQLFloat },
		dtp: { type: GraphQLFloat },
  }),
});

const JournalBalanceType = new GraphQLObjectType({
  name: 'JournalBalanceType',
  fields: () => ({
    _id: { type: GraphQLString },
    production: { type: JournalEmpType },
    administration: { type: JournalEmpType },
		totMandiri: { type: GraphQLFloat },
		totFinalPay: { type: GraphQLFloat },
		totExpat: { type: GraphQLFloat },
		totTool: { type: GraphQLFloat },
		totCanteen: { type: GraphQLFloat },
		totLoan: { type: GraphQLFloat },
		totKopkar: { type: GraphQLFloat },
		totKer: { type: GraphQLFloat },
		totKes: { type: GraphQLFloat },
		totTax: { type: GraphQLFloat },
		totProduction: { type: GraphQLFloat },
		totAdministration: { type: GraphQLFloat },
		tot1: { type: GraphQLFloat },
		tot2: { type: GraphQLFloat },
		tot3: { type: GraphQLFloat },
		pensionProd: { type: GraphQLFloat },
		pensionAdm: { type: GraphQLFloat },
		totPension: { type: GraphQLFloat },
		totGross: { type: GraphQLFloat },
		totJurnal: { type: GraphQLFloat },
		totSelisih: { type: GraphQLFloat },
  }),
});

const EmployeeJType = new GraphQLObjectType({
  name: 'EmployeeJType',
  fields: () => ({
    _id: { type: GraphQLString },
    d0: { type: GraphQLString },
    e0: { type: GraphQLString },
    l0: { type: GraphQLFloat },
    u0: { type: GraphQLString },
    v0: { type: GraphQLString },
    w0: { type: GraphQLString },
    y0: { type: GraphQLString },
    ai0: { type: GraphQLFloat },
    bu0: { type: GraphQLFloat },
    bv0: { type: GraphQLFloat },
    bx0: { type: GraphQLFloat },
    cb0: { type: GraphQLFloat },
    cc0: { type: GraphQLFloat },
    cg0: { type: GraphQLFloat },
    cq0: { type: GraphQLFloat },
    cs0: { type: GraphQLFloat },
    cy0: { type: GraphQLFloat },
    df0: { type: GraphQLFloat },
    ef0: { type: GraphQLFloat },
    eg0: { type: GraphQLFloat },
    eh0: { type: GraphQLFloat },
    ei0: { type: GraphQLFloat },
    ej0: { type: GraphQLFloat },
    ek0: { type: GraphQLFloat },
    el0: { type: GraphQLFloat },
    em0: { type: GraphQLFloat },
    eo0: { type: GraphQLFloat },
    es0: { type: GraphQLFloat },
  }),
});

const JournalType = new GraphQLObjectType({
  name: 'JournalType',
  fields: () => ({
    _id: { type: GraphQLString },
    employeeA: { type: new GraphQLList(EmployeeJType) },
    employeeP: { type: new GraphQLList(EmployeeJType) },
  }),
});

module.exports = { JournalType, JournalBalanceType };
