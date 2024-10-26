import express from 'express';
import { ApolloServer } from '@apollo/server';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { createRouteHandler } from 'uploadthing/express';
import { uploadRouter } from './uploadThing.js';
import { csvUploadController } from './back-end/controllers/csvFunctions.js';
import { updateSubscriber } from './back-end/controllers/subscriberFunctions.js';
import multer from 'multer';
dotenv.config();

// Database Connection
import { connectToDatabase } from './back-end/config/database.js';

// Type Definitions
import { typeDefs, resolvers } from './back-end/graphql.js';

// JWT Validators
import { validateToken } from './back-end/jwt.js';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(cors());
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
      app.use('/api/uploadCSV', upload.single('file'), async (req, res) => {
        console.log(req.file);
        if (req.file) {
          const { decodedToken, isValid } = req.context;
          if (!isValid || decodedToken.userType !== UserRole.ADMINUSER) {
            return res.status(401).json({
              isSuccessful: false,
              message: 'Unauthorized to perform this operation.',
            });
          }

          try {
            return csvUploadController(req.file);
          } catch (error) {
            console.error('CSV Upload Failed:', error);
            return res.status(500).json({
              isSuccessful: false,
              message: 'Some error occurred',
            });
          }
        } else {
          res.status(400).send('No file uploaded.');
        }
      });
      app.use(
        '/api/uploadthing',
        createRouteHandler({
          router: uploadRouter,
        })
      );
      app.use('/api/hook', async (req, res) => {
        console.log(req);
        try {
          const { type, customer } = req.body;

          if (type === 'coupon_claimed' && customer && customer.phone) {
            const mobileNumber = customer.phone;

            await updateSubscriber(mobileNumber, res);

            res.status(200);
          } else {
            res.status(200);
          }
        } catch (error) {
          console.error('Error updating subscriber:', error);
          res.status(500);
        }
        res.send({ Status: 'Success' });
      });
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

      app.get('*', (req, res) => {
        res.sendFile(join(__dirname, './front-end/dist/index.html'));
      });

      const PORT = process.env.PORT || 8888;
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
