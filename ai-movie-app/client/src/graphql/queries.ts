import { gql } from '@apollo/client';

export const GET_ALL_MOVIES = gql`
  query GetAllMovies {
    getAllMovies {
      id
      name
      description
      isInTheatres
      directors
      releaseYear
      genre
      rating
      studio
      runtime
      thumbnail
      downloadLinks
      watchLinks
    }
  }
`;

export const GET_MOVIE_DETAIL = gql`
  query GetMovieDetail($id: ID!) {
    getMovieById(id: $id) {
      id
      name
      description
      isInTheatres
      directors
      releaseYear
      genre
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
      watchList {
        id
        name
        thumbnail
        rating
        releaseYear
      }
      watchedMovies {
        id
        name
        thumbnail
        rating
        releaseYear
      }
      downloadedMovies {
        id
        name
        thumbnail
        rating
        releaseYear
      }
    }
  }
`;