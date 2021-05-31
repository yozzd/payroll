const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql');

const PercentageCategoryType = new GraphQLObjectType({
  name: 'PercentageCategoryType',
  fields: () => ({
    department: { type: GraphQLString },
    upah: { type: GraphQLFloat },
    ot: { type: GraphQLFloat },
    percentage: { type: GraphQLFloat },
    active: { type: GraphQLFloat },
    finalPay: { type: GraphQLFloat },
  }),
});

const PercentageType = new GraphQLObjectType({
  name: 'PercentageType',
  fields: () => ({
    _id: { type: GraphQLString },
    period: { type: GraphQLString },
    dir: { type: GraphQLString },
    year: { type: GraphQLInt },
    totUpah: { type: GraphQLFloat },
    totOt: { type: GraphQLFloat },
    totActive: { type: GraphQLFloat },
    totFinalPay: { type: GraphQLFloat },
    category: { type: new GraphQLList(PercentageCategoryType) },
  }),
});

module.exports = { PercentageType };
