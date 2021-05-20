const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} = require('graphql');

const fs = require('fs-extra');

const SlipThrCheckType = new GraphQLObjectType({
  name: 'SlipThrCheckType',
  fields: () => ({
    name: { type: GraphQLString },
    dir: { type: GraphQLString },
    check: {
      type: GraphQLBoolean,
      resolve: async (p) => {
        try {
          await fs.access(`static/thr/${p.dir}/${p.name}.pdf`);
          return true;
        } catch (err) {
          if (err) return false;
          return false;
        }
      },
    },
  }),
});

const EmployeeThrType = new GraphQLObjectType({
  name: 'EmployeeThrType',
  fields: () => ({
    _id: { type: GraphQLString },
    b0: { type: GraphQLString },
    c0: { type: GraphQLString },
    e0: { type: GraphQLString },
    thrPass: { type: GraphQLBoolean },
    slip: { type: SlipThrCheckType },
  }),
});

const ThrType = new GraphQLObjectType({
  name: 'ThrType',
  fields: () => ({
    _id: { type: GraphQLString },
    from: { type: GraphQLString },
    to: { type: GraphQLString },
    year: { type: GraphQLInt },
    period: { type: GraphQLString },
    employee: { type: new GraphQLList(EmployeeThrType) },
  }),
});

module.exports = { ThrType };
