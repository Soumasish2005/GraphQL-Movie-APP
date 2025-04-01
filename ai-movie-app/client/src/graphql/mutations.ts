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


export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export const DELETE_MOVIE = gql`
  mutation DeleteMovie($id: ID!) {
    deleteMovie(id: $id) {
      id
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) {
      id
    }
  }
`;

export const ADD_MOVIE = gql`
  mutation AddMovie($input: MovieInput!) {
    addMovie(input: $input) {
      id
      title
      isInTheatres
      description
      thumbnail
      downloadLinks
      watchLinks
      directors
      releaseYear
      genres
      rating
      studio
      runtime
    }
  }
`;

export const UPDATE_MOVIE = gql`
  mutation UpdateMovie($id: ID!, $input: MovieInput!) {
    updateMovie(id: $id, input: $input) {
      id
      title
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
    }
  }
`;

export const ADD_REPLY = gql`
  mutation AddReply($commentId: ID!, $text: String!) {
    addReply(commentId: $commentId, text: $text) {
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

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: ID!, $text: String!) {
    updateComment(id: $id, text: $text) {
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

export const UPDATE_REPLY = gql`
  mutation UpdateReply($id: ID!, $text: String!) {
    updateReply(id: $id, text: $text) {
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

export const DELETE_REPLY = gql`
  mutation DeleteReply($id: ID!) {
    deleteReply(id: $id) {
      id
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
        title
        thumbnail
        rating
      }
    }
  }
`;