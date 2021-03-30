const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} = require('graphql');

const fs = require('fs-extra');

const SlipProrateCheckType = new GraphQLObjectType({
  name: 'SlipProrateCheckType',
  fields: () => ({
    name: { type: GraphQLString },
    dir: { type: GraphQLString },
    check: {
      type: GraphQLBoolean,
      resolve: async (p) => {
        try {
          await fs.access(`static/prorate/${p.dir}/${p.name}.pdf`);
          return true;
        } catch (err) {
          if (err) return false;
          return false;
        }
      },
    },
  }),
});

const EmployeeProrateType = new GraphQLObjectType({
  name: 'EmployeeProrateType',
  fields: () => ({
    _id: { type: GraphQLString },
    b0: { type: GraphQLString },
    c0: { type: GraphQLString },
    e0: { type: GraphQLString },
    slip: { type: SlipProrateCheckType },
  }),
});

const ProrateType = new GraphQLObjectType({
  name: 'ProrateType',
  fields: () => ({
    _id: { type: GraphQLString },
    from: { type: GraphQLString },
    to: { type: GraphQLString },
    year: { type: GraphQLInt },
    period: { type: GraphQLString },
    employee: { type: new GraphQLList(EmployeeProrateType) },
  }),
});

module.exports = { ProrateType };
