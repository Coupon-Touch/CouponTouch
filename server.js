import express from 'express';
import compression from 'compression';
import { ApolloServer } from '@apollo/server';
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
import PaymentAPI from './payment.js';
import { existsSync } from 'fs';
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
app.use((req, res, next) => {
  if (
    !req.secure &&
    req.hostname.endsWith('coupontouch.net') &&
    !req.url.startsWith('/api/hook')
  ) {
    console.log('Need to redirect');
  } else if (req.url.startsWith('/api')) {
    compression()(req, res, next);
  }
  next();
});

app.use(express.json());
app.use(cors());
// Middleware to log static files being served

const sendHTML = (req, res) => {
  res.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  res.sendFile(join(__dirname, './front-end/dist/index.html'));
};
function getMimeType(filePath) {
  const ext = filePath.split('.').pop();
  const mimeTypes = {
    js: 'application/javascript',
    css: 'text/css',
    html: 'text/html',
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    svg: 'image/svg+xml',
    // Add more types as needed
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }

  const filePath = join(__dirname, './front-end/dist', req.url);
  const gzFilePath = `${filePath}.gz`;

  // Set cache headers
  res.set('Cache-Control', 'public, max-age=31536000, immutable');

  // Check if the gzipped file exists
  if (existsSync(gzFilePath) && !req.url.includes('..') && req.url !== '/') {
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', getMimeType(filePath)); // Optionally, set the correct Content-Type
    res.sendFile(gzFilePath);
  } else if (
    existsSync(filePath) &&
    !req.url.includes('..') &&
    req.url !== '/'
  ) {
    res.sendFile(filePath, err => {
      if (err) {
        sendHTML(req, res);
      }
    });
  } else {
    sendHTML(req, res);
  }
});

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
      REST({ app });
      PaymentAPI({ app });
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
    } else {
      app.get('*', (req, res) => {
        res.send('Could Not Connect to database');
      });
      console.error('Database connection failed.');
    }
  } catch (error) {
    console.error('Error starting the server:', error);
  }
  const PORT = process.env.PORT || 8888;
  app.listen(PORT, () => {
    console.log('Server Up and Running on Port:', PORT);
  });
}



const REST = ({ app }) => {
  app.use('/api/uploadCSV', upload.single('file'), async (req, res) => {
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
    try {
      const { type, customer, coupon } = req.body;
      if (type === 'coupon_claimed' && customer && customer.phone) {
        const mobileNumber = customer.phone;
        const prizeName = coupon.coupon_value;

        await updateSubscriber(mobileNumber, res, prizeName);

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
};


startServer();
