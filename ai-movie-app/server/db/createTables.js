import connectDB from './connection.js';

const createTables = async () => {
  const client = await connectDB();
  try {
    const checkTablesQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'movies', 'comments')
      );
    `;
    const res = await client.query(checkTablesQuery);
    if (res.rows[0].exists) {
      return;
    }

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        "watchedMovies" JSONB DEFAULT '[]',
        "downloadedMovies" JSONB DEFAULT '[]',
        "watchList" JSONB DEFAULT '[]',
        role VARCHAR(50),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description VARCHAR(255),
        directors VARCHAR(100)[],
        "releaseYear" INT,
        "isInTheatres" BOOLEAN,
        runtime INT,
        rating FLOAT,
        genre VARCHAR(100)[],
        studio VARCHAR(100),
        thumbnail VARCHAR(255),
        "downloadLinks" VARCHAR(255)[],
        "watchLinks" VARCHAR(255)[],
        UNIQUE (name, "releaseYear")
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        "userId" INT REFERENCES users(id),
        "movieId" INT REFERENCES movies(id),
        text TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "parentId" INT REFERENCES comments(id) ON DELETE CASCADE
      );
    `);

    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    client.end();
  }
};

export default createTables;
