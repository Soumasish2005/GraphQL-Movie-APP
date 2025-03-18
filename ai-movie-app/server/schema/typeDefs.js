import { gql } from 'graphql-tag';

export const typeDefs = gql`
    type User{
        id: ID!
        name: String!
        email: String!
        password: String!
        role: String
        createdAt: String
        updatedAt: String
        watchedMovies: [Movie]
        downloadedMovies: [Movie]
        watchList: [Movie]
    }
    type Comment{
        id: ID!
        user: User
        movie: Movie
        text: String
        createdAt: String
        updatedAt: String
    }
    type Movie{
        id: ID!
        name: String!
        isInTheatres: Boolean
        director: String
        releaseYear: Int
        genre: [String]
        comments: [Comment]
        rating: Float
        studio: String
        runtime: Int
    }
    input MovieInput {
        name: String
        isInTheatres: Boolean
        director: String
        releaseYear: Int
        genre: [String]
        rating: Float
        studio: String
        runtime: Int
    }
    type Query {
        getAllMovies: [Movie!]!
        getAllUsers: [User!]!
        getUserWatchList(id: ID!): [Movie]
        getUserWatchedMovies(id: ID!): [Movie]
        getUserDownloadedMovies(id: ID!): [Movie]
        getUserById(id: ID!): User
        getMovieById(id: ID!): Movie
        filterMoviesByInput(filter: MovieInput): [Movie]
    }
    type Mutation {
        createUser(name: String!, email: String!, password: String!): User
        updateUser(id: ID!, name: String, email: String, password: String): User
        deleteUser(id: ID!): User
        addMovie(input: MovieInput): Movie
        updateMovie(input: MovieInput): Movie
        deleteMovie(id: ID!): Movie
        addToWatchList(userId: ID!, movieId: ID!): User
        removeFromWatchList(userId: ID!, movieId: ID!): User
        addToWatchedMovies(userId: ID!, movieId: ID!): User
        removeFromWatchedMovies(userId: ID!, movieId: ID!): User
        addToDownloadedMovies(userId: ID!, movieId: ID!): User
        removeFromDownloadedMovies(userId: ID!, movieId: ID!): User
    }
`;