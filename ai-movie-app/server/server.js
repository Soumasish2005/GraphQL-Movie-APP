import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './schema/resolvers.js';
import connectDB from './db/connection.js';
import createTables from './db/createTables.js'; // Import createTables
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const startServer = async () => {
  // Connecting to the database
  const db = await connectDB();
  await createTables(); // Creating tables

  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => {
      return { db }; // Passing db connection context
    }
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async () => {
        return { db }; // Passing db connection context
      }
    })
  );

  const PORT = process.env.PORT || 4000;

  app.listen({ port: PORT }, () => {
    console.log(`GraphQL server running on http://localhost:4000/graphql`);
  });
};

startServer();