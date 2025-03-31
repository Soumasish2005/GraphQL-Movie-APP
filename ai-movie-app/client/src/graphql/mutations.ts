import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($userId: ID!, $movieId: ID!, $text: String!) {
    addComment(userId: $userId, movieId: $movieId, text: $text) {
      id
      text
      createdAt
      user {
        id
        name
      }
    }
  }
`;

export const ADD_TO_WATCHLIST = gql`
  mutation addToWatchList($userId: ID!, $movieId: ID!) {
    addToWatchList(userId: $userId, movieId: $movieId) {
      id
      watchList {
        id
        title
        thumbnail
        rating
      }
    }
  }
`;

export const REMOVE_FROM_WATCHLIST = gql`
  mutation RemoveFromWatchList($userId: ID!, $movieId: ID!) {
    removeFromWatchList(userId: $userId, movieId: $movieId) {
      id
      watchList {
        id
        name
        thumbnail
        rating
      }
    }
  }
`;