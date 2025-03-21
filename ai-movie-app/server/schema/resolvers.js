import { movies, users } from '../data/test-data.js';
import writeToDB from '../db/writeToDB.js';

export const resolvers = {
    Query: {
        getAllMovies: async (_, __, { db }) => {
            try {
                console.log('Fetching all movies from the database...');
                const res = await db.query('SELECT * FROM movies');
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
        filterMoviesByInput: async (_, { filter }, { db }) => {
            try {
                const conditions = [];
                const values = [];
                let index = 1;

                const filterMapping = {
                    name: (value) => [`LOWER(name) LIKE LOWER($${index++})`, `%${value}%`],
                    directors: (value) => [`$${index++} = ANY(directors)`, value],
                    releaseYear: (value) => [`"releaseYear" = $${index++}`, value],
                    genre: (value) => [`$${index++} = ANY(genre)`, value],
                    rating: (value) => [`rating >= $${index++}`, value],
                    studio: (value) => [`LOWER(studio) LIKE LOWER($${index++})`, `%${value}%`],
                    runtime: (value) => [`runtime >= $${index++}`, value]
                };

                Object.entries(filter).forEach(([key, value]) => {
                    if (filterMapping[key]) {
                        const [condition, val] = filterMapping[key](value);
                        conditions.push(condition);
                        values.push(val);
                    }
                });

                const query = `
                    SELECT * FROM movies
                    ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
                `;
                const res = await db.query(query, values);
                return res.rows;
            } catch (err) {
                console.error('Error filtering movies:', err);
                throw new Error('Error filtering movies');
            }
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