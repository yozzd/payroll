import gql from 'graphql-tag';

export const UserCreate = gql`
  mutation userCreate($username: String!, $password: String!, $role: String!) {
    userCreate(username: $username, password: $password, role: $role) {
      _id
      username
      role
    }
  }
`;
export const UserChangePassword = gql`
  mutation userChangePassword($id: String!, $oldPassword: String!, $newPassword: String!) {
    userChangePassword(id: $id, oldPassword: $oldPassword, newPassword: $newPassword) {
      _id
      username
      role
    }
  }
`;
