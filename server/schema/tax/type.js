const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} = require('graphql');

const fs = require('fs-extra');

const SlipTaxCheckType = new GraphQLObjectType({
  name: 'SlipTaxCheckType',
  fields: () => ({
    name: { type: GraphQLString },
    dir: { type: GraphQLString },
    check: {
      type: GraphQLBoolean,
      resolve: async (p) => {
        try {
          await fs.access(`static/tax/${p.dir}/${p.name}.pdf`);
          return true;
        } catch (err) {
          if (err) return false;
          return false;
        }
      },
    },
  }),
});

const EmployeeTaxType = new GraphQLObjectType({
  name: 'EmployeeTaxType',
  fields: () => ({
    _id: { type: GraphQLString },
    b0: { type: GraphQLString },
    c0: { type: GraphQLString },
    e0: { type: GraphQLString },
    slip: { type: SlipTaxCheckType },
  }),
});

const TaxType = new GraphQLObjectType({
  name: 'TaxType',
  fields: () => ({
    _id: { type: GraphQLString },
    from: { type: GraphQLString },
    to: { type: GraphQLString },
    year: { type: GraphQLInt },
    period: { type: GraphQLString },
    employee: { type: new GraphQLList(EmployeeTaxType) },
  }),
});

module.exports = { TaxType };
