import { ApolloServer} from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import  { movies, animeMovies } from './test-data.js';
const typeDefs = `
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
        getAllAnimeMovies: [AnimeMovie!]!
        filterMoviesByRating(rating: Float): [Movie]
        filterAnimesByInput(filter: AnimeFilterInput): [AnimeMovie]
    }
`

const resolvers = {
    Query: {
        getAllMovies: () => {
            return movies;
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