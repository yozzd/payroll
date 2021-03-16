const {
  GraphQLInputObjectType,
  GraphQLString,
} = require('graphql');

const AddEmployeeInputType = new GraphQLInputObjectType({
  name: 'AddEmployeeInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    d0: { type: GraphQLString },
    e0: { type: GraphQLString },
    g0: { type: GraphQLString },
    j0: { type: GraphQLString },
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
