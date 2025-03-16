import fs from 'fs';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.resolve(__dirname, process.env.DB_SSL_CA_PATH)).toString(),
    },
};

const client = new pg.Client(config);

const connectDB = async () => {
    try {
        await client.connect();
        console.log('PostgreSQL connected');
    } catch (err) {
        console.error('PostgreSQL connection error:', err);
        process.exit(1);
    }
};

export default connectDB;