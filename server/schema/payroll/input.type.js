const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const AddEmployeeInputType = new GraphQLInputObjectType({
  name: 'AddEmployeeInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    d0: { type: GraphQLString },
    e0: { type: GraphQLString },
    g0: { type: GraphQLString },
    h0: { type: GraphQLString },
    i0: { type: GraphQLString },
    j0: { type: GraphQLInt },
    k0: { type: GraphQLString },
    n0: { type: GraphQLString },
    o0: { type: GraphQLString },
    p0: { type: GraphQLString },
    r0: { type: GraphQLString },
    u0: { type: GraphQLString },
    v0: { type: GraphQLString },
    co0: { type: GraphQLInt },
    ew0: { type: GraphQLString },
  }),
});

const ClonePayrollInputType = new GraphQLInputObjectType({
  name: 'ClonePayrollInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    from: { type: GraphQLString },
    to: { type: GraphQLString },
  }),
});

const DeleteInputType = new GraphQLInputObjectType({
  name: 'DeleteInputType',
  fields: () => ({
    _id: { type: GraphQLString },
  }),
});

module.exports = {
  AddEmployeeInputType,
  ClonePayrollInputType,
  DeleteInputType,
};
