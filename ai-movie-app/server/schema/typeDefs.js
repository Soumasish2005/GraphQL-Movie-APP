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
        director: String
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
        getUserById(id: ID!): User
        getMovieById(id: ID!): Movie
        getAnimeMovieById(id: ID!): AnimeMovie
        filterMoviesByInput(filter: MovieInput): [Movie]
        filterAnimesByInput(filter: AnimeMovieInput): [AnimeMovie]
    }
    input MovieInput {
        name: String!
        isInTheatres: Boolean
        director: String
        releaseYear: Int
        genre: String
        rating: Float
    }
    input AnimeMovieInput {
        name: String
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
        addAnimeMovie(input: AnimeMovieInput): AnimeMovie
        updateMovie(input: MovieInput): Movie
        updateAnimeMovie(input: AnimeMovieInput): AnimeMovie
        deleteMovie(id: ID!): Movie
        deleteAnimeMovie(id: ID!): AnimeMovie
    }
`;