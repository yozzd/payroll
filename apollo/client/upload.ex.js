import { createUploadLink } from 'apollo-upload-client';

export default () => ({
  defaultHttpLink: false,
  link: createUploadLink({ uri: 'http://localhost:3001/graphql' }),
});
