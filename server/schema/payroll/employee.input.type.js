const {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLString,
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

const PrivateInputType = new GraphQLInputObjectType({
  name: 'PrivateInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    n0: { type: GraphQLString },
    o0: { type: GraphQLString },
    p0: { type: GraphQLString },
    q0: { type: GraphQLString },
    r0: { type: GraphQLString },
    s0: { type: GraphQLString },
    t0: { type: GraphQLString },
    z0: { type: GraphQLString },
    aa0: { type: GraphQLString },
    ew0: { type: GraphQLString },
  }),
});

const OvertimeInputType = new GraphQLInputObjectType({
  name: 'OvertimeInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    ab0: { type: GraphQLFloat },
    ad0: { type: GraphQLFloat },
    af0: { type: GraphQLFloat },
    ag0: { type: GraphQLInt },
  }),
});

const FixedAllowanceInputType = new GraphQLInputObjectType({
  name: 'FixedAllowanceInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    aj0: { type: GraphQLInt },
    ak0: { type: GraphQLInt },
    al0: { type: GraphQLInt },
    am0: { type: GraphQLInt },
    an0: { type: GraphQLInt },
    ao0: { type: GraphQLInt },
    ap0: { type: GraphQLInt },
    aq0: { type: GraphQLInt },
    ar0: { type: GraphQLInt },
    as0: { type: GraphQLInt },
    at0: { type: GraphQLInt },
    au0: { type: GraphQLInt },
    av0: { type: GraphQLInt },
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

/** *********************************************** */

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

const EditPrivateInputType = new GraphQLInputObjectType({
  name: 'EditPrivateInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: PrivateInputType },
  }),
});

const EditOvertimeInputType = new GraphQLInputObjectType({
  name: 'EditOvertimeInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: OvertimeInputType },
  }),
});

const EditFixedAllowanceInputType = new GraphQLInputObjectType({
  name: 'EditFixedAllowanceInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: FixedAllowanceInputType },
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
  EditPrivateInputType,
  EditOvertimeInputType,
  EditFixedAllowanceInputType,
  EditFlagsEmployeeInputType,
};
