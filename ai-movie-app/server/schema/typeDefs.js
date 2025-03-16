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
        rating: Float
    }
    type AnimeMovie {
        id: ID!
        name: String!
        isInTheatres: Boolean
        Director: String
        releaseYear: Int
        genre: String
        rating: Float
        studio: String
        runtime: Int
    }

    input AnimeFilterInput {
        name: String
        Director: String
        releaseYear: Int
        genre: String
        rating: Float
        studio: String
        runtime: Int
    }
    type Query {
        getAllMovies: [Movie!]!
        getAllUsers: [User!]!
        getAllAnimeMovies: [AnimeMovie!]!
        filterMoviesByRating(rating: Float): [Movie]
        filterAnimesByInput(filter: AnimeFilterInput): [AnimeMovie]
    }
    type Mutation {
        createUser(name: String!, email: String!, password: String!): User
        updateUser(id: ID!, name: String, email: String, password: String): User
        deleteUser(id: ID!): User
    }
`;