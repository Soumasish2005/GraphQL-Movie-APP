import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './schema/resolvers.js';
import connectDB from './db/connection.js';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
// Connect to the database
connectDB();

const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers
});

await server.start();

app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server)
);

const PORT = process.env.PORT || 4000;

app.listen({ port: PORT }, () => {
    console.log(`GraphQL server running on http://localhost:4000/graphql`);
});