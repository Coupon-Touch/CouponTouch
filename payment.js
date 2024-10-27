import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

class Payment {
  #URLS = {
    auth: 'https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token',
    createOrder:
      'https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/2b6dc55a-1ffd-4da9-b5ef-5744d3edb5de/orders',
  };
  #token;
  #authToken;
  #expires;
  constructor() {
    this.#token = process.env.NETWORK_INTERNATIONAL_TOKEN;
    this.#authToken = undefined;
    this.#expires = 0;
  }

  async #getAuthToken() {
    if (this.#authToken && this.#expires > Date.now()) {
      return this.#authToken;
    }
    const response = await fetch(this.#URLS.auth, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.ni-identity.v1+json',
        Authorization: `Basic ${this.#token}`,
      },
      body: JSON.stringify({
        expires_in: 300,
        token_type: 'bearer',
      }),
    });
    if (response.status < 200 && response.status >= 300) {
      throw new Error('Failed to get auth token');
    }
    const data = await response.json();
    this.#authToken = data.access_token;
    this.#expires = Date.now() + data.expires_in * 1000 - 500;
    return this.#authToken;
  }
  async createOrder(amount, currencyCode = 'AED') {
    if (!amount) {
      console.error('Amount is required');
    }
    const authToken = await this.#getAuthToken();
    const response = {
      paymentLink: null,
      amount: amount,
      currencyCode: currencyCode,
      createdDate: null,
      refference: '',
      orderCreate: {},
      orderStatus: {},
      isOrderComplete: false,
    };

    await new Promise(resolve => {
      fetch(this.#URLS.createOrder, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.ni-payment.v2+json',
          Accept: 'application/vnd.ni-payment.v2+json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          action: 'SALE',
          amount: { currencyCode: currencyCode, value: amount },
        }),
      })
        .then(async res => {
          if (res.status < 200 && res.status >= 300) {
            throw new Error('Failed to create order');
          }
          const data = await res.json();

          response.paymentLink = data._links['payment'].href;
          response.amount = data.amount.value;
          response.currencyCode = data.amount.currencyCode;
          response.createdDate = data.createDateTime;
          response.refference = data.reference;
          response.orderCreate = data;
          resolve();
        })
        .catch(error => {
          throw new Error('Failed to create order', error);
        });
    });

    return response;
  }
}

const payment = new Payment();
const PaymentAPI = ({ app }) => {
  app.post('/api/payment/create', (req, res) => {
    if (!req.context || req.context.isValid === false) {
      res.status(401).send('Unauthorized');
      return;
    }
    if (!req.body.amount || req.body.amount <= 0) {
      res.status(400).send('Amount is required');
      return;
    }
    const amount = req.body.amount;
    //TODO check if he is not subscriber
    const response = {
      paymentLink: null,
    };
    payment
      .createOrder(amount)
      .then(data => {
        response.paymentLink = data.paymentLink;
        res.send(response);
      })
      .catch(error => {
        console.error(error);
        res.send(response);
      });
  });

  app.use('/api/payment/hook', async (req, res) => {
    console.log(req.body);
    const directory = path.join(__dirname, 'requests');
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    const fileName = `${uuidv4()}.json`;
    const filePath = path.join(directory, fileName);

    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.send('Succcess');
  });
};

export default PaymentAPI;
