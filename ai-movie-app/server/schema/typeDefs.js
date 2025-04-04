import { gql } from 'graphql-tag';

export const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        avatar: String
        role: Role
        createdAt: String
        updatedAt: String
        watchedMovies: [Movie]
        downloadedMovies: [Movie]
        watchList: [Movie]
    }
    enum Role {
        REGULAR
        ADMIN
    }
    type Comment {
        id: ID!
        user: User
        text: String
        likes: Int
        dislikes: Int
        createdAt: String
        updatedAt: String
        userId: ID!
        movieId: ID!
        replies: [Comment]
        parentId: ID
    }
    type Movie {
        id: ID!
        title: String!
        description: String
        isInTheatres: Boolean
        directors: [String]
        actors: [String]
        languages: [String]
        releaseYear: Int
        genres: [String]
        rating: Float
        studio: String
        runtime: Int
        thumbnail: String
        downloadLinks: [String]
        watchLinks: [String]
        trailer: String
    }
    input MovieInput {
        title: String!
        description: String
        isInTheatres: Boolean
        directors: [String]
        actors: [String]
        languages: [String]
        releaseYear: Int
        genres: [String]
        rating: Float
        studio: String
        runtime: Int
        thumbnail: String
        downloadLinks: [String]
        watchLinks: [String]
        trailer: String
    }
    type Query {
        getAllUsers: [User!]!
        getUserWatchList(userId: ID!): [Movie]
        getUserWatchedMovies(id: ID!): [Movie]
        getUserDownloadedMovies(id: ID!): [Movie]
        getUserById(id: ID!): User

        getAllMovies: [Movie!]!
        getMovieById(id: ID!): Movie
        getCommentsByMovieId(movieId: ID!): [Comment]
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
        updateMovie(id: ID!, input: MovieInput): Movie
        deleteMovie(id: ID!): Movie
        addMovies(inputs: [MovieInput]): [Movie]

        addComment(userId: ID!, movieId: ID!, text: String): Comment
        updateComment(id: ID!, text: String): Comment
        addReplyToComment(userId: ID!, commentId: ID!, text: String): Comment
        updateReplyToComment(id: ID!, text: String): Comment
        deleteComment(id: ID!): Comment
        deleteReplyToComment(id: ID!): Comment

        login(email: String!, password: String!): AuthPayload
    }

    type AuthPayload {
        token: String!
        user: User!
    }
`;