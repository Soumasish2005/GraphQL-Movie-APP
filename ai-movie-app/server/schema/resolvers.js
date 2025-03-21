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
        },
        getCommentsByMovieId: async (_, { movieId }, { db }) => {
            try {
                console.log(`Fetching comments for movie ID ${movieId} from the database...`);
                const query = 'SELECT * FROM comments WHERE "movieId" = $1';
                const values = [movieId];
                const res = await db.query(query, values);
                console.log('Comments fetched successfully:', res.rows);
                return res.rows;
            } catch (err) {
                console.error('Error fetching comments:', err);
                throw new Error('Error fetching comments');
            }
        },
    },
    Mutation: {
        createUser: async (_, { name, email, password, role }, { db }) => {
            const query = `
                INSERT INTO users ("name", "email", "password", "role", "createdAt", "updatedAt")
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;
            const values = [name, email, password, role || 'REGULAR', new Date().toISOString(), new Date().toISOString()];
            const newUser = await writeToDB(db, query, values);
            return newUser;
        },
        updateUser: async (_, { id, name, email, password }, { db }) => {
            const query = `
                UPDATE users
                SET name = $1, email = $2, password = $3, updatedAt = $4
                WHERE id = $5
                RETURNING *;
            `;
            const values = [name, email, password, new Date().toISOString(), id];
            const updatedUser = await writeToDB(db, query, values);
            return updatedUser;
        },
        deleteUser: async (_, { id }, { db }) => {
            const query = `
                DELETE FROM users
                WHERE id = $1
                RETURNING *;
            `;
            const values = [id];
            const deletedUser = await writeToDB(db, query, values);
            return deletedUser;
        },
        addMovie: async (_, { input }, { db }) => {
            const { name, directors, releaseYear, genre, rating, isInTheatres, studio, runtime } = input;
            const query = `
                INSERT INTO movies ("name", "directors", "releaseYear", "genre", "rating", "isInTheatres", "studio", "runtime")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *;
            `;
            const values = [name, directors, releaseYear, genre, rating, isInTheatres, studio, runtime];
            const newMovie = await writeToDB(db, query, values);
            return newMovie;
        },
        addMovies: async (_, { inputs }, { db }) => {
            const query = `
                INSERT INTO movies ("name", "directors", "releaseYear", "genre", "rating", "isInTheatres", "studio", "runtime", "description", "thumbnail", "downloadLinks", "watchLinks")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING *;
            `;
            const addedMovies = [];
            for (const input of inputs) {
                const { name, directors, releaseYear, genre, rating, isInTheatres, studio, runtime, description, thumbnail, downloadLinks, watchLinks } = input;
                const values = [name, directors, releaseYear, genre, rating, isInTheatres, studio, runtime, description, thumbnail, downloadLinks, watchLinks];
                const newMovie = await writeToDB(db, query, values);
                addedMovies.push(newMovie);
            }
            return addedMovies;
        }
    }
};