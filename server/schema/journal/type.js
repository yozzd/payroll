const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql');

const { EmployeeType } = require('../payroll/employee.type');

const JournalEmpType = new GraphQLObjectType({
  name: 'JournalEmpType',
  fields: () => ({
    category: { type: GraphQLInt },
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
    termination: { type: GraphQLFloat },
    taxReturn: { type: GraphQLFloat },
    dtp: { type: GraphQLFloat },
    bonus: { type: GraphQLFloat },
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
    totRetroPay: { type: GraphQLFloat },
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
    totPesangonPay: { type: GraphQLFloat },
    totMangkirPay: { type: GraphQLFloat },
    totPphKurangBayar: { type: GraphQLFloat },
  }),
});

const JournalType = new GraphQLObjectType({
  name: 'JournalType',
  fields: () => ({
    _id: { type: GraphQLString },
    employeeA: { type: new GraphQLList(EmployeeType) },
    employeeP: { type: new GraphQLList(EmployeeType) },
  }),
});

module.exports = { JournalType, JournalBalanceType };
