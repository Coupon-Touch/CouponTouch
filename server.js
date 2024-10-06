import express from 'express';
import { ApolloServer } from '@apollo/server';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Database Connection
import { connectToDatabase } from './back-end/config/database.js';

// Type Definitions
import { typeDefs, resolvers } from './back-end/graphql.js';

// User Models

// JWT Validators
import { validateToken } from './back-end/jwt.js';

const app = express();
app.use(bodyParser.json());
app.use(cors());

async function startServer() {
  try {
    const dbConnected = await connectToDatabase();
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    await server.start();

    if (dbConnected) {
      app.use(
        '/api',
        expressMiddleware(server, {
          context: ({ req, res }) => {
            const authorizationHeader = req.headers.authorization;
            if (authorizationHeader) {
              const token = authorizationHeader.replace('Bearer ', '');
              const { userId, isValid } = validateToken(token);
              return {
                userId: userId,
                isValid: isValid,
                req: req,
                res: res,
              };
            } else {
              return {
                userId: null,
                isValid: false,
                req: req,
                res: res,
              };
            }
          },
        })
      );
      const PORT = process.env.PORT || 8000;
      app.listen(PORT, () => {
        console.log('Server Up and Running on Port:', PORT);
      });
    } else {
      console.error('Database connection failed.');
    }
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

startServer();
