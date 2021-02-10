const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean,
} = require('graphql');

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

const EditFlagsEmployeeInputType = new GraphQLInputObjectType({
  name: 'EditFlagsEmployeeInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    employee: { type: FlagsInputType },
  }),
});

module.exports = { AddEmployeeInputType, EditFlagsEmployeeInputType };
