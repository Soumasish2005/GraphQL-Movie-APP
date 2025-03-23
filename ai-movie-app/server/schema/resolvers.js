import { movies, users } from '../data/test-data.js';
import writeToDB from '../db/writeToDB.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
        getUserById: async (_, { id }, { db }) => {
            try {
                console.log(`Fetching user with ID ${id} from the database...`);
                const query = 'SELECT * FROM users WHERE id = $1';
                const values = [id];
                const res = await db.query(query, values);
                const user = res.rows[0];
                if (!user) {
                    throw new Error('No user found with this ID');
                }
                return user;
            } catch (err) {
                console.error('Error fetching user:', err);
                throw new Error('Error fetching user');
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
                const query = 'SELECT * FROM comments WHERE "movieId" = $1 AND "parentId" IS NULL';
                const values = [movieId];
                const res = await db.query(query, values);
                const comments = res.rows;
                for (const comment of comments) {
                    const repliesQuery = 'SELECT * FROM comments WHERE "parentId" = $1';
                    const repliesValues = [comment.id];
                    const repliesRes = await db.query(repliesQuery, repliesValues);
                    comment.replies = repliesRes.rows;
                    for (const reply of comment.replies) {
                        const userQuery = 'SELECT * FROM users WHERE id = $1';
                        const userValues = [reply.userId];
                        const userRes = await db.query(userQuery, userValues);
                        reply.user = userRes.rows[0];

                        // Fetch user data for replies to replies
                        const subRepliesQuery = 'SELECT * FROM comments WHERE "parentId" = $1';
                        const subRepliesValues = [reply.id];
                        const subRepliesRes = await db.query(subRepliesQuery, subRepliesValues);
                        reply.replies = subRepliesRes.rows;
                        for (const subReply of reply.replies) {
                            const subUserQuery = 'SELECT * FROM users WHERE id = $1';
                            const subUserValues = [subReply.userId];
                            const subUserRes = await db.query(subUserQuery, subUserValues);
                            subReply.user = subUserRes.rows[0];
                        }
                    }
                    const userQuery = 'SELECT * FROM users WHERE id = $1';
                    const userValues = [comment.userId];
                    const userRes = await db.query(userQuery, userValues);
                    comment.user = userRes.rows[0];
                }
                return comments;
            } catch (err) {
                console.error('Error fetching comments:', err);
                throw new Error('Error fetching comments');
            }
        },
    },
    Mutation: {
        createUser: async (_, { name, email, password, role }, { db }) => {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
            const query = `
                INSERT INTO users ("name", "email", "password", "role", "createdAt", "updatedAt")
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;
            const values = [name, email, hashedPassword, role || 'REGULAR', new Date().toISOString(), new Date().toISOString()];
            const newUser = await writeToDB(db, query, values);
            return newUser;
        },
        updateUser: async (_, { id, name, email, password }, { db }) => {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
            const query = `
                UPDATE users
                SET name = $1, email = $2, password = $3, updatedAt = $4
                WHERE id = $5
                RETURNING *;
            `;
            const values = [name, email, hashedPassword, new Date().toISOString(), id];
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
        },
        addComment: async (_, { userId, movieId, text }, { db }) => {
            const query = `
                INSERT INTO comments ("userId", "movieId", text, "createdAt", "updatedAt")
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
            const values = [userId, movieId, text, new Date().toISOString(), new Date().toISOString()];
            const newComment = await writeToDB(db, query, values);
            return newComment;
        },
        updateComment: async (_, { id, text }, { db }) => {
            const query = `
                UPDATE comments
                SET text = $1, "updatedAt" = $2
                WHERE id = $3
                RETURNING *;
            `;
            const values = [text, new Date().toISOString(), id];
            const updatedComment = await writeToDB(db, query, values);
            return updatedComment;
        },
        addReplyToComment: async (_, { userId, commentId, text }, { db }) => {
            const query = `
                INSERT INTO comments ("userId", "movieId", text, "createdAt", "updatedAt", "parentId")
                VALUES ($1, (SELECT "movieId" FROM comments WHERE id = $2), $3, $4, $5, $2)
                RETURNING *;
            `;
            const values = [userId, commentId, text, new Date().toISOString(), new Date().toISOString()];
            const newReply = await writeToDB(db, query, values);
            return newReply;
        },
        updateReplyToComment: async (_, { id, text }, { db }) => {
            const query = `
                UPDATE comments
                SET text = $1, "updatedAt" = $2
                WHERE id = $3
                RETURNING *;
            `;
            const values = [text, new Date().toISOString(), id];
            const updatedReply = await writeToDB(db, query, values);
            return updatedReply;
        },
        deleteComment: async (_, { id }, { db }) => {
            const query = `
                DELETE FROM comments
                WHERE id = $1
                RETURNING *;
            `;
            const values = [id];
            const deletedComment = await writeToDB(db, query, values);
            return deletedComment;
        },
        deleteReplyToComment: async (_, { id }, { db }) => {
            const query = `
                DELETE FROM comments
                WHERE id = $1
                RETURNING *;
            `;
            const values = [id];
            const deletedReply = await writeToDB(db, query, values);
            return deletedReply;
        },
        login: async (_, { email, password }, { db }) => {
            const query = 'SELECT * FROM users WHERE email = $1';
            const values = [email];
            const res = await db.query(query, values);
            const user = res.rows[0];

            if (!user) {
                throw new Error('No user found with this email');
            }

            const valid = await bcrypt.compare(password, user.password); // Compare plain password with hashed password
            if (!valid) {
                throw new Error('Invalid password');
            }

            // Generate JWT
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return {
                token,
                user,
            };
        }
    }
};