import gql from 'graphql-tag';

export const UserChangePassword = gql`
  mutation userChangePassword($id: String!, $oldPassword: String!, $newPassword: String!) {
    userChangePassword(id: $id, oldPassword: $oldPassword, newPassword: $newPassword) {
      _id
      username
      role
    }
  }
`;

export const faker = '';
