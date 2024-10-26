const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 80;

app.use(express.json());

const helloHttp = () => {
  app.use('/api/hook', async (req, res) => {
    const targetUrl = 'https://coupontouch.net/api/hook/';

    try {
      const response = await axios.post(targetUrl, req.body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      res.status(response.status).send(response.data);
    } catch (error) {
      console.error('Error forwarding the request:', error.message);
      res.status(500).send({ error: 'Failed to forward request' });
    }
  });

  app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
  });
};

helloHttp();
