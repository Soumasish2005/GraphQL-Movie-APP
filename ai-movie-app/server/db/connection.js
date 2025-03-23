import fs from 'fs';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const caCertBase64 = process.env.DB_CA_CERT;
const caCertBuffer = Buffer.from(caCertBase64, 'base64');
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true,
        ca: caCertBuffer.toString() || fs.readFileSync(path.resolve(__dirname, process.env.DB_SSL_CA_PATH)).toString(),
    },
};

const connectDB = async () => {
    const client = new pg.Client(config);
    try {
        await client.connect();
        console.log('PostgreSQL connected');
        return client;
    } catch (err) {
        console.error('PostgreSQL connection error:', err);
        process.exit(1);
    }
};

export default connectDB;