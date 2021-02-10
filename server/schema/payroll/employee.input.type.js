const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean,
} = require('graphql');

const EmployeeInputType = new GraphQLInputObjectType({
  name: 'EmployeeInputType',
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

const EditFlagsEmployeeInputType = new GraphQLInputObjectType({
  name: 'EditFlagsEmployeeInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: EmployeeInputType },
  }),
});

module.exports = { AddEmployeeInputType, EditFlagsEmployeeInputType };
