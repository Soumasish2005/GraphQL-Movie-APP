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
    enum role{
        REGULAR
        ADMIN
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
        description: String
        isInTheatres: Boolean
        directors: [String]
        releaseYear: Int
        genre: [String]
        comments: [Comment]
        rating: Float
        studio: String
        runtime: Int
        thumbnail: String
        downloadLinks: [String]
        watchLinks: [String]
    }
    input MovieInput {
        name: String
        isInTheatres: Boolean
        directors: [String]
        releaseYear: Int
        genre: [String]
        rating: Float
        studio: String
        runtime: Int
    }
    type Query {
        getAllUsers: [User!]!
        getUserWatchList(id: ID!): [Movie]
        getUserWatchedMovies(id: ID!): [Movie]
        getUserDownloadedMovies(id: ID!): [Movie]
        getUserById(id: ID!): User

        getAllMovies: [Movie!]!
        getMovieById(id: ID!): Movie
        filterMoviesByInput(filter: MovieInput): [Movie]
    }
    type Mutation {
        createUser(name: String!, email: String!, password: String!): User
        updateUser(id: ID!, name: String, email: String, password: String): User
        deleteUser(id: ID!): User

        
        addToWatchList(userId: ID!, movieId: ID!): User
        removeFromWatchList(userId: ID!, movieId: ID!): User
        addToWatchedMovies(userId: ID!, movieId: ID!): User
        removeFromWatchedMovies(userId: ID!, movieId: ID!): User
        addToDownloadedMovies(userId: ID!, movieId: ID!): User
        removeFromDownloadedMovies(userId: ID!, movieId: ID!): User
        
        addMovie(input: MovieInput): Movie
        updateMovie(input: MovieInput): Movie
        deleteMovie(id: ID!): Movie
    }
`;