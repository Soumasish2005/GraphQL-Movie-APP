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
                const usersQuery = 'SELECT * FROM users';
                const usersRes = await db.query(usersQuery);
                const users = usersRes.rows;

                for (const user of users) {
                    const watchListQuery = `
                        SELECT m.*
                        FROM user_watchlist uw
                        JOIN movies m ON uw."movieId" = m.id
                        WHERE uw."userId" = $1;
                    `;
                    const watchListRes = await db.query(watchListQuery, [user.id]);
                    user.watchList = watchListRes.rows; // Add watchlist to each user
                }

                console.log('Users fetched successfully:', users);
                return users;
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

                // Fetch movies from watchlist
                const watchListQuery = `
                    SELECT m.*
                    FROM user_watchlist uw
                    JOIN movies m ON uw."movieId" = m.id
                    WHERE uw."userId" = $1;
                `;
                const watchListRes = await db.query(watchListQuery, [id]);
                user.watchList = watchListRes.rows;

                return user;
            } catch (err) {
                console.error('Error fetching user:', err);
                throw new Error('Error fetching user');
            }
        },
        getUserWatchList: async (_, { userId }, { db }) => {
            try {
                const query = `
                    SELECT m.*
                    FROM user_watchlist uw
                    JOIN movies m ON uw."movieId" = m.id
                    WHERE uw."userId" = $1;
                `;
                const values = [userId];
                const res = await db.query(query, values);
                return res.rows; // Return the list of movies
            } catch (err) {
                console.error('Error fetching user watchlist:', err);
                throw new Error('Error fetching user watchlist');
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
        getMovieById: async (_, { id }, { db }) => {
            try {
                console.log(`Fetching movie with ID ${id} from the database...`);
                const query = 'SELECT * FROM movies WHERE id = $1';
                const values = [id];
                const res = await db.query(query, values);
                const movie = res.rows[0];
                if (!movie) {
                    throw new Error('No movie found with this ID');
                }
                return movie;
            } catch (err) {
                console.error('Error fetching movie:', err);
                throw new Error('Error fetching movie');
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
            try {
                // Delete associated comments
                const deleteCommentsQuery = `
                    DELETE FROM comments
                    WHERE "userId" = $1;
                `;
                await db.query(deleteCommentsQuery, [id]);

                // Delete the user
                const query = `
                    DELETE FROM users
                    WHERE id = $1
                    RETURNING *;
                `;
                const values = [id];
                const deletedUser = await writeToDB(db, query, values);
                return deletedUser;
            } catch (err) {
                console.error('Error deleting user:', err);
                throw new Error('Error deleting user');
            }
        },
        addMovie: async (_, { input }, { db }) => {
            try {
                console.log('Adding movie to the database...', input);
                const { title, description, isInTheatres, directors, actors, languages, releaseYear, genres, rating, studio, runtime, thumbnail, downloadLinks, watchLinks, trailer } = input;
                const query = `
                    INSERT INTO movies ("title","description", "isInTheatres", "directors", "actors", "languages", "releaseYear", "genres", "rating", "studio", "runtime", "thumbnail", "downloadLinks", "watchLinks", "trailer")
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                    RETURNING *;
                `;
                const values = [title, description || null, isInTheatres, directors || null, actors || null, languages || null, releaseYear, genres || null, rating, studio, runtime, thumbnail, downloadLinks || null, watchLinks || null, trailer];
                const newMovie = await writeToDB(db, query, values);
                return newMovie;
            } catch (err) {
                console.error('Error adding movie:', err);
                throw new Error('Error adding movie');
            }
        },
        updateMovie: async (_, { id, input }, { db }) => {
            const fields = [];
            const values = [];
            let index = 1;

            for (const [key, value] of Object.entries(input)) {
                fields.push(`"${key}" = $${index++}`);
                values.push(value);
            }

            values.push(id); // Add the movie ID as the last value

            const query = `
                UPDATE movies
                SET ${fields.join(', ')}
                WHERE id = $${index}
                RETURNING *;
            `;

            const updatedMovie = await writeToDB(db, query, values);
            return updatedMovie;
        },
        deleteMovie: async (_, { id }, { db }) => {
            const query = `
                DELETE FROM movies
                WHERE id = $1
                RETURNING *;
            `;
            const values = [id];
            const deletedMovie = await writeToDB(db, query, values);
            console.log(`Movie with ID ${id} deleted successfully.`);
            // Optionally, delete associated comments
            const deleteCommentsQuery = `
                DELETE FROM comments
                WHERE "movieId" = $1;
            `;
            const deleteCommentsValues = [id];
            await db.query(deleteCommentsQuery, deleteCommentsValues);
            console.log(`Comments associated with movie ID ${id} deleted successfully.`);
            return deletedMovie;
        },
        addToWatchList: async (_, { userId, movieId }, { db }) => {
            try {
                const query = `
                    INSERT INTO user_watchlist ("userId", "movieId")
                    VALUES ($1, $2)
                    ON CONFLICT ("userId", "movieId") DO NOTHING
                    RETURNING *;
                `;
                const values = [userId, movieId];
                await db.query(query, values);

                // Fetch and return the updated user
                const userQuery = 'SELECT * FROM users WHERE id = $1';
                const userRes = await db.query(userQuery, [userId]);
                const watchListQuery = `
                    SELECT m.*
                    FROM user_watchlist uw
                    JOIN movies m ON uw."movieId" = m.id
                    WHERE uw."userId" = $1;
                `;
                const watchListRes = await db.query(watchListQuery, [userId]);
                return {
                    ...userRes.rows[0],
                    id: userId,
                    watchList: watchListRes.rows,
                };
            } catch (err) {
                console.error('Error adding to watchlist:', err);
                throw new Error('Error adding to watchlist');
            }
        },
        removeFromWatchList: async (_, { userId, movieId }, { db }) => {
            try {
                const query = `
                    DELETE FROM user_watchlist
                    WHERE "userId" = $1 AND "movieId" = $2
                    RETURNING *;
                `;
                const values = [userId, movieId];
                await db.query(query, values);

                // Fetch and return the updated user
                const userQuery = 'SELECT * FROM users WHERE id = $1';
                const userRes = await db.query(userQuery, [userId]);
                return userRes.rows[0];
            } catch (err) {
                console.error('Error removing from watchlist:', err);
                throw new Error('Error removing from watchlist');
            }
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
        },
    }
};