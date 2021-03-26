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
    d0: { type: GraphQLString },
    e0: { type: GraphQLString },
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

const BasicInputType = new GraphQLInputObjectType({
  name: 'BasicInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    g0: { type: GraphQLInt },
    ay0: { type: GraphQLInt },
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

const NonFixedAllowanceInputType = new GraphQLInputObjectType({
  name: 'NonFixedAllowanceInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    ba0: { type: GraphQLInt },
    bb0: { type: GraphQLInt },
    bc0: { type: GraphQLInt },
    bd0: { type: GraphQLInt },
    be0: { type: GraphQLInt },
    bf0: { type: GraphQLInt },
    bg0: { type: GraphQLInt },
    bh0: { type: GraphQLInt },
    bi0: { type: GraphQLInt },
  }),
});

const RetroFillInputType = new GraphQLInputObjectType({
  name: 'RetroFillInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    bl0: { type: GraphQLInt },
    bm0: { type: GraphQLInt },
    bn0: { type: GraphQLInt },
    bo0: { type: GraphQLInt },
    bp0: { type: GraphQLInt },
    bq0: { type: GraphQLInt },
    br0: { type: GraphQLInt },
    bs0: { type: GraphQLInt },
    bt0: { type: GraphQLInt },
  }),
});

const LeaveInputType = new GraphQLInputObjectType({
  name: 'LeavelInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    by0: { type: GraphQLFloat },
  }),
});

const EarningOthersInputType = new GraphQLInputObjectType({
  name: 'EarningOthersInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    bv0: { type: GraphQLInt },
    bw0: { type: GraphQLInt },
    dr0: { type: GraphQLInt },
    ds0: { type: GraphQLInt },
    du0: { type: GraphQLInt },
    dw0: { type: GraphQLInt },
  }),
});

const AbsentInputType = new GraphQLInputObjectType({
  name: 'AbsentlInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    cw0: { type: GraphQLFloat },
  }),
});

const ReductionInputType = new GraphQLInputObjectType({
  name: 'ReductionInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    dc0: { type: GraphQLInt },
    dd0: { type: GraphQLInt },
    de0: { type: GraphQLInt },
    dg0: { type: GraphQLInt },
    dh0: { type: GraphQLInt },
    di0: { type: GraphQLInt },
  }),
});

const DeductionOthersInputType = new GraphQLInputObjectType({
  name: 'DeductionOthersInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    dk0: { type: GraphQLInt },
    dl0: { type: GraphQLInt },
    dm0: { type: GraphQLInt },
    dn0: { type: GraphQLInt },
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

const ManualInputType = new GraphQLInputObjectType({
  name: 'ManualInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    fc0: { type: GraphQLInt },
  }),
});

const FinalInputType = new GraphQLInputObjectType({
  name: 'FinalInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    fDate: { type: GraphQLString },
  }),
});

/** *********************************************** */

const CloneEmployeeInputType = new GraphQLInputObjectType({
  name: 'CloneEmployeeInputType',
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

const EditBasicInputType = new GraphQLInputObjectType({
  name: 'EditBasicInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: BasicInputType },
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

const EditNonFixedAllowanceInputType = new GraphQLInputObjectType({
  name: 'EditNonFixedAllowanceInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: NonFixedAllowanceInputType },
  }),
});

const EditRetroFillInputType = new GraphQLInputObjectType({
  name: 'EditRetroFillInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: RetroFillInputType },
  }),
});

const EditLeaveInputType = new GraphQLInputObjectType({
  name: 'EditLeaveInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: LeaveInputType },
  }),
});

const EditEarningOthersInputType = new GraphQLInputObjectType({
  name: 'EditEarningOthersInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: EarningOthersInputType },
  }),
});

const EditAbsentInputType = new GraphQLInputObjectType({
  name: 'EditAbsentInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: AbsentInputType },
  }),
});

const EditReductionInputType = new GraphQLInputObjectType({
  name: 'EditReductionInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: ReductionInputType },
  }),
});

const EditDeductionOthersInputType = new GraphQLInputObjectType({
  name: 'EditDeductionOthersInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: DeductionOthersInputType },
  }),
});

const EditFlagsEmployeeInputType = new GraphQLInputObjectType({
  name: 'EditFlagsEmployeeInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: FlagsInputType },
  }),
});

const EditManualEmployeeInputType = new GraphQLInputObjectType({
  name: 'EditManualEmployeeInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: ManualInputType },
  }),
});

const EditFinalEmployeeInputType = new GraphQLInputObjectType({
  name: 'EditFinalEmployeeInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: FinalInputType },
  }),
});

module.exports = {
  CloneEmployeeInputType,
  EditEmploymentInputType,
  EditPrivateInputType,
  EditBasicInputType,
  EditOvertimeInputType,
  EditFixedAllowanceInputType,
  EditNonFixedAllowanceInputType,
  EditRetroFillInputType,
  EditLeaveInputType,
  EditEarningOthersInputType,
  EditAbsentInputType,
  EditReductionInputType,
  EditDeductionOthersInputType,
  EditFlagsEmployeeInputType,
  EditManualEmployeeInputType,
  EditFinalEmployeeInputType,
};
