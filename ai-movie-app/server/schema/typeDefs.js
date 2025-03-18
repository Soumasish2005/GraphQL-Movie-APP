import { gql } from 'graphql-tag';

export const typeDefs = gql`
    type User{
        id: ID!,
        name: String!,
        email: String!,
        password: String!,
        role: String,
        createdAt: String,
        updatedAt: String,
        movies: [Movie]
    }
    type Movie{
        id: ID!,
        name: String!,
        isInTheatres: Boolean,
        director: String,
        releaseYear: Int,
        genre: String,
        rating: Float,
        studio: String
        runtime: Int
    }
    type Query {
        getAllMovies: [Movie!]!
        getAllUsers: [User!]!
        getUserById(id: ID!): User
        getMovieById(id: ID!): Movie
        filterMoviesByInput(filter: MovieInput): [Movie]
    }
    input MovieInput {
        name: String!
        isInTheatres: Boolean
        director: String
        releaseYear: Int
        genre: String
        rating: Float
        studio: String
        runtime: Int
    }
    type Mutation {
        createUser(name: String!, email: String!, password: String!): User
        updateUser(id: ID!, name: String, email: String, password: String): User
        deleteUser(id: ID!): User
        addMovie(input: MovieInput): Movie
        updateMovie(input: MovieInput): Movie
        deleteMovie(id: ID!): Movie
    }
`;