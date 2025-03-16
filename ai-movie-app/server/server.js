import { ApolloServer} from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import  { movies, animeMovies, users } from './test-data.js';
import { gql } from 'graphql-tag';
const typeDefs = gql`
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
`

const resolvers = {
    Query: {
        getAllMovies: () => {
            return movies;
        },
        getAllUsers: () => {
            return users;
        },
        getAllAnimeMovies: () => {
            return animeMovies;
        },
        filterMoviesByRating: (_,{ rating }) => {
            return movies.filter((movie) => movie.rating >= rating);
        },
        filterAnimesByInput: (_, { filter }) => {
            return animeMovies.filter(anime => 
                (!filter.name || anime.name.toLowerCase().includes(filter.name.toLowerCase())) &&
                (!filter.Director || anime.Director.toLowerCase().includes(filter.Director.toLowerCase())) &&
                (!filter.releaseYear || anime.releaseYear === filter.releaseYear) &&
                (!filter.genre || anime.genre.toLowerCase().includes(filter.genre.toLowerCase())) &&
                (!filter.rating || anime.rating >= filter.rating) &&
                (!filter.studio || anime.studio.toLowerCase().includes(filter.studio.toLowerCase())) &&
                (!filter.runtime || anime.runtime >= filter.runtime)
            );
        }
    },
    Mutation: {
        createUser: (_, { name, email, password, role }) => {
            const newUser = {
                id: String(users.length + 1),
                name,
                email,
                password,
                role: role || 'regular',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                movies: []
            };
            users.unshift(newUser);
            return newUser;
        },
        updateUser: (_, { id, name, email, password }) => {
            const userIndex = users.findIndex(user => user.id === id);
            if (userIndex === -1) {
                throw new Error('User not found');
            }
            const updatedUser = {
                ...users[userIndex],
                name: name || users[userIndex].name,
                email: email || users[userIndex].email,
                password: password || users[userIndex].password,
                updatedAt: new Date().toISOString()
            };
            users[userIndex] = updatedUser;
            return updatedUser;
        },
        deleteUser: (_, { id }) => {
            const userIndex = users.findIndex(user => user.id === id);
            if (userIndex === -1) {
                throw new Error('User not found');
            }
            const deletedUser = users[userIndex];
            // const users = users.filter(user => user.id !== id);
            // return users;
            return deletedUser;
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

const { url }= await startStandaloneServer(server, {
    listen: {
        port: 4000,
    }
})

console.log(`GraphQL server running on ${url}`);