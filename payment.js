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

// TODO store status of winners
// TODO do this payment

/**
 * SUCCESS
{
  outletId: '2b6dc55a-1ffd-4da9-b5ef-5744d3edb5de',
  eventId: '7b31edea-8504-4c36-9e5d-fa108e84bd30',
  eventName: 'AUTHORISED',
  order: {
    _id: 'urn:order:ee8bce45-4bd0-48b7-9e77-683322ccf65c',
    _links: {
      cancel: [Object],
      self: [Object],
      'tenant-brand': [Object],
      'merchant-brand': [Object]
    },
    type: 'SINGLE',
    merchantDefinedData: {},
    action: 'SALE',
    amount: { currencyCode: 'AED', value: 12500 },
    language: 'en',
    merchantAttributes: {},
    reference: 'ee8bce45-4bd0-48b7-9e77-683322ccf65c',
    outletId: '2b6dc55a-1ffd-4da9-b5ef-5744d3edb5de',
    createDateTime: '2024-11-06T15:28:58.134557695Z',
    paymentMethods: { card: [Array] },
    referrer: 'urn:Ecom:ee8bce45-4bd0-48b7-9e77-683322ccf65c',
    isSplitPayment: false,
    formattedOrderSummary: {},
    formattedAmount: 'د.إ.‏ 125',
    formattedOriginalAmount: '',
    _embedded: { payment: [Array] }
  }
}


FAILURE
{
  outletId: '2b6dc55a-1ffd-4da9-b5ef-5744d3edb5de',
  eventId: '35be85f1-d0ce-44aa-b26f-1be94f286bcb',
  eventName: 'GATEWAY_RISK_PRE_AUTH_REJECTED',
  order: {
    _id: 'urn:order:2d898c7f-9832-401b-9a04-7d6955591039',
    _links: {
      self: [Object],
      'tenant-brand': [Object],
      'merchant-brand': [Object]
    },
    type: 'SINGLE',
    merchantDefinedData: {},
    action: 'SALE',
    amount: { currencyCode: 'AED', value: 12500 },
    language: 'en',
    merchantAttributes: {},
    reference: '2d898c7f-9832-401b-9a04-7d6955591039',
    outletId: '2b6dc55a-1ffd-4da9-b5ef-5744d3edb5de',
    createDateTime: '2024-11-06T15:31:29.411049149Z',
    paymentMethods: { card: [Array] },
    referrer: 'urn:Ecom:2d898c7f-9832-401b-9a04-7d6955591039',
    isSplitPayment: false,
    formattedOrderSummary: {},
    formattedAmount: 'د.إ.‏ 125',
    formattedOriginalAmount: '',
    _embedded: { payment: [Array] }
  }
}
 */
