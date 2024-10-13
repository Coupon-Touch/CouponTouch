import express from 'express';
import { ApolloServer } from '@apollo/server';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Database Connection
import { connectToDatabase } from './back-end/config/database.js';

// Type Definitions
import { typeDefs, resolvers } from './back-end/graphql.js';

// JWT Validators
import { validateToken } from './back-end/jwt.js';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, './front-end/dist')));

const authMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    const token = authorizationHeader.replace('Bearer ', '');
    const { decodedToken, isValid } = validateToken(token);
    req.context = {
      decodedToken,
      isValid,
    };
  } else {
    req.context = {
      decodedToken: null,
      isValid: false,
    };
  }
  next();
};

app.use(authMiddleware);

async function startServer() {
  try {
    const dbConnected = await connectToDatabase();
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      playground: true,
    });

    await server.start();

    if (dbConnected) {
      app.use(
        '/api',
        expressMiddleware(server, {
          context: ({ req, res }) => {
            return {
              ...req.context,
              req,
              res,
            };
          },
        })
      );

      app.get('/uploadCSV', async (req, res) => {
        const { decodedToken, isValid } = req.context;
        if (!isValid || decodedToken.userType !== UserRole.ADMINUSER) {
          return res.status(401).json({
            isSuccessful: false,
            message: 'Unauthorized to perform this operation.',
          });
        }

        try {
          await csvUploadController(req.body);
          return res.status(200).json({
            isSuccessful: true,
            message: 'CSV uploaded successfully.',
          });
        } catch (error) {
          console.error('CSV Upload Failed:', error);
          return res.status(500).json({
            isSuccessful: false,
            message: 'Some error occurred',
          });
        }
      });

      app.get('*', (req, res) => {
        res.sendFile(join(__dirname, './front-end/dist/index.html'));
      });

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
