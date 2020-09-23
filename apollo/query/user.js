import gql from 'graphql-tag';

export const Users = gql`
  query users {
    users {
      _id
      username
      role
    }
  }
`;

export const Me = gql`
  query {
    me {
      _id
      username
      role
    }
  }
`;
