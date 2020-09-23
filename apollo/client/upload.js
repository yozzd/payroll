import { createUploadLink } from 'apollo-upload-client';

export default () => ({
  defaultHttpLink: false,
  link: createUploadLink({ uri: 'http://190.1.7.73:3006/graphql' }),
});
