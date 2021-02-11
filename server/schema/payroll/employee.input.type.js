const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean,
} = require('graphql');

const EmploymentInputType = new GraphQLInputObjectType({
  name: 'EmploymentInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    h0: { type: GraphQLString },
    i0: { type: GraphQLString },
    k0: { type: GraphQLString },
    u0: { type: GraphQLString },
    v0: { type: GraphQLString },
    w0: { type: GraphQLString },
    x0: { type: GraphQLString },
    y0: { type: GraphQLString },
  }),
});

const FlagsInputType = new GraphQLInputObjectType({
  name: 'FlagsInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    ex0: { type: GraphQLBoolean },
    ey0: { type: GraphQLBoolean },
    ez0: { type: GraphQLBoolean },
    fb0: { type: GraphQLBoolean },
  }),
});

const AddEmployeeInputType = new GraphQLInputObjectType({
  name: 'AddEmployeeInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    e0: { type: GraphQLString },
  }),
});

const EditEmploymentInputType = new GraphQLInputObjectType({
  name: 'EditEmploymentInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: EmploymentInputType },
  }),
});

const EditFlagsEmployeeInputType = new GraphQLInputObjectType({
  name: 'EditFlagsEmployeeInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: FlagsInputType },
  }),
});

module.exports = {
  AddEmployeeInputType,
  EditEmploymentInputType,
  EditFlagsEmployeeInputType,
};
