import { movies, users } from '../data/test-data.js';

export const resolvers = {
    Query: {
        getAllMovies: () => {
            return movies;
        },
        getAllUsers: () => {
            return users;
        },
        filterMoviesByInput: (_, { filter }) => {
            return movies.filter(movie => 
                (!filter.name || movie.name.toLowerCase().includes(filter.name.toLowerCase())) &&
                (!filter.director || movie.director.toLowerCase().includes(filter.director.toLowerCase())) &&
                (!filter.releaseYear || movie.releaseYear === filter.releaseYear) &&
                (!filter.genre || filter.genre.every(g => movie.genre.includes(g))) &&
                (!filter.rating || movie.rating >= filter.rating) &&
                (!filter.studio || movie.studio.toLowerCase().includes(filter.studio.toLowerCase())) &&
                (!filter.runtime || movie.runtime >= filter.runtime)
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
            const { name, director, releaseYear, genre, rating, isInTheatres, studio, runtime } = input;
            const newMovie = {
                id: String(movies.length + 1),
                name,
                director,
                releaseYear,
                genre,
                rating,
                isInTheatres,
                studio,
                runtime
            };
            movies.unshift(newMovie);
            return newMovie;
        }
    }
};