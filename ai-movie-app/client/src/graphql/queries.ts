import { gql } from '@apollo/client';

export const GET_ALL_MOVIES = gql`
  query GetAllMovies {
    getAllMovies {
      id
      title
      description
      isInTheatres
      directors
      releaseYear
      genres
      rating
      studio
      runtime
      thumbnail
      downloadLinks
      watchLinks
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      email
      role
      watchList {
        id
        title
        thumbnail
        rating
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      name
      email
      watchList {
        id
        title
        thumbnail
        rating
      }
    }
  }
`;
export const GET_MOVIE_DETAIL = gql`
  query GetMovieDetail($id: ID!) {
    getMovieById(id: $id) {
      id
      title
      description
      isInTheatres
      directors
      releaseYear
      genres
      rating
      studio
      runtime
      thumbnail
      downloadLinks
      watchLinks
    }
  }
`;

export const GET_MOVIE_COMMENTS = gql`
  query GetMovieComments($movieId: ID!) {
    getCommentsByMovieId(movieId: $movieId) {
      id
      text
      createdAt
      updatedAt
      user {
        id
        name
      }
      replies {
        id
        text
        createdAt
        updatedAt
        user {
          id
          name
        }
      }
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($id: ID!) {
    getUserById(id: $id) {
      id
      name
      email
    }
  }
`;

export const GET_USER_WATCHLIST = gql`
  query GetUserWatchList($userId: ID!) {
    getUserWatchList(userId: $userId) {
      id
      title
      thumbnail
      rating
      releaseYear
      runtime
      genres
      description
    }
  }
`;