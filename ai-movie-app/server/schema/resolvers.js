import { movies, animeMovies, users } from '../data/test-data.js';

export const resolvers = {
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
        },
        addMovie: (_, { input }) => {
            const { name, director , releaseYear , genre , rating, isInTheatres } = input;
            console.log("Input arguments:", { name, director, releaseYear, genre, rating, isInTheatres });
            const newMovie = {
                id: String(movies.length + 1),
                name,
                director,
                releaseYear,
                genre,
                rating,
                isInTheatres
            };
            console.log("New movie object:", newMovie);
            movies.unshift(newMovie);
            return newMovie;
        }
    }
}