import gql from 'graphql-tag';

export default gql`
  query auth($username: String!, $password: String!) {
    auth(username: $username, password: $password) {
      token
    }
  }
`;
