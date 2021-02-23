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

const KantinInputType = new GraphQLInputObjectType({
  name: 'KantinInputType',
  fields: () => ({
    _id: { type: GraphQLString },
    file: { type: GraphQLUpload },
  }),
});

module.exports = { ImportInputType, KantinInputType };
