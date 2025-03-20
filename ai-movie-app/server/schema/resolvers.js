import { movies, users } from '../data/test-data.js';
import writeToDB from '../db/writeToDB.js';

export const resolvers = {
    Query: {
        getAllMovies: async (_, __, { db }) => {
            try {
                console.log('Fetching all movies from the database...');
                const res = await db.query('SELECT * FROM movies');
                console.log('Movies fetched successfully:', res.rows);
                return res.rows;
            } catch (err) {
                console.error('Error fetching movies:', err);
                throw new Error('Error fetching movies');
            }
        },
        getAllUsers: async (_, __, { db }) => {
            try {
                console.log('Fetching all users from the database...');
                const res = await db.query('SELECT * FROM users');
                console.log('Users fetched successfully:', res.rows);
                return res.rows;
            } catch (err) {
                console.error('Error fetching users:', err);
                throw new Error('Error fetching users');
            }
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
        createUser: async (_, { name, email, password, role }) => {
            // const newUser = {
            //     id: String(users.length + 1),
            //     name,
            //     email,
            //     password,
            //     role: role || 'REGULAR',
            //     createdAt: new Date().toISOString(),
            //     updatedAt: new Date().toISOString(),
            //     movies: []
            // };
            // users.unshift(newUser);
            const query = `
                INSERT INTO users ("name", "email", "password", "role", "createdAt", "updatedAt")
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;
            const values = [name, email, password, role || 'REGULAR', new Date().toISOString(), new Date().toISOString()];
            await writeToDB(query, values);
            return newUser;
        },
        updateUser: async (_, { id, name, email, password }) => {
            // const userIndex = users.findIndex(user => user.id === id);
            // if (userIndex === -1) {
            //     throw new Error('User not found');
            // }
            // const updatedUser = {
            //     ...users[userIndex],
            //     name: name || users[userIndex].name,
            //     email: email || users[userIndex].email,
            //     password: password || users[userIndex].password,
            //     updatedAt: new Date().toISOString()
            // };
            // users[userIndex] = updatedUser;
            const query = `
                UPDATE users
                SET name = $1, email = $2, password = $3, updatedAt = $4
                WHERE id = $5
                RETURNING *;
            `;
            const values = [name || users[userIndex].name, email || users[userIndex].email, password || users[userIndex].password, new Date().toISOString(), id];
            await writeToDB(query, values);
            return updatedUser;
        },
        deleteUser: async (_, { id }) => {
            // const userIndex = users.findIndex(user => user.id === id);
            // if (userIndex === -1) {
            //     throw new Error('User not found');
            // }
            // const deletedUser = users[userIndex];
            // users.splice(userIndex, 1);
            const query = `
                DELETE FROM users
                WHERE id = $1
                RETURNING *;
            `;
            const values = [id];
            await writeToDB(query, values);
            return deletedUser;
        },
        addMovie: async (_, { input }) => {
            const { name, directors, releaseYear, genre, rating, isInTheatres, studio, runtime } = input;
            // const newMovie = {
            //     id: String(movies.length + 1),
            //     name,
            //     director,
            //     releaseYear,
            //     genre,
            //     rating,
            //     isInTheatres,
            //     studio,
            //     runtime
            // };
            // movies.unshift(newMovie);
            const query = `
                INSERT INTO movies ("name", "directors", "releaseYear", "genre", "rating", "isInTheatres", "studio", "runtime")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *;
            `;
            const values = [name, directors, releaseYear, genre, rating, isInTheatres, studio, runtime];
            const res = await writeToDB(query, values);
            console.log(res)
            return res;
        }
    }
};