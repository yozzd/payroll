const {
  GraphQLInputObjectType,
  GraphQLString,
} = require('graphql');
const { GraphQLUpload } = require('graphql-upload');

const ImportInputType = new GraphQLInputObjectType({
  name: 'ImportInputType',
  fields: () => ({
    file: { type: GraphQLUpload },
    from: { type: GraphQLString },
    to: { type: GraphQLString },
  }),
});

const ExtImportInputType = new GraphQLInputObjectType({
  name: 'ExtImportInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    file: { type: GraphQLUpload },
  }),
});

module.exports = { ImportInputType, ExtImportInputType };
