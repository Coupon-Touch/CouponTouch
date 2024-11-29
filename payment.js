import { UserRole } from './back-end/utilities/userRoles.js';
import { PaymentModel } from './back-end/models/paymentSchema.js';
import { Subscriber } from './back-end/models/subscriber.js';

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

    try {
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

      if (!response.ok) {
        throw new Error(`Failed to get auth token, status: ${response.status}`);
      }

      const data = await response.json();
      this.#authToken = data.access_token;
      this.#expires = Date.now() + data.expires_in * 1000 - 500;
      return this.#authToken;
    } catch (error) {
      console.error('Error fetching auth token:', error);
      throw new Error('Authentication failed');
    }
  }

  async createOrder(amount, currencyCode = 'AED') {
    if (!amount) {
      throw new Error('Amount is required');
    }

    const authToken = await this.#getAuthToken();
    const response = {
      paymentLink: null,
      amount: amount,
      currencyCode: currencyCode,
      createdDate: null,
      reference: '',
      orderCreate: {},
      orderStatus: {},
      isOrderComplete: false,
    };

    try {
      const res = await fetch(this.#URLS.createOrder, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.ni-payment.v2+json',
          Accept: 'application/vnd.ni-payment.v2+json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          action: 'PURCHASE',
          amount: { currencyCode: currencyCode, value: amount },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Order creation failed:', errorData);
        throw new Error('Failed to create order');
      }

      const data = await res.json();
      response.paymentLink = data._links['payment'].href;
      response.amount = data.amount.value;
      response.currencyCode = data.amount.currencyCode;
      response.createdDate = data.createDateTime;
      response.reference = data.reference;
      response.orderCreate = data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }

    return response;
  }
}

const payment = new Payment();

const PaymentAPI = ({ app }) => {
  app.post('/api/payment/create', async (req, res) => {
    if (!req.context || req.context.isValid === false) {
      return res.status(401).send('Unauthorized');
    }

    if (!req.body.amount || req.body.amount <= 0) {
      return res.status(400).send('Amount is required');
    }

    const { decodedToken } = req.context;

    if (!decodedToken || !(decodedToken.userType === UserRole.SUBSCRIBER)) {
      return res
        .status(401)
        .send('Unauthorized, You must be a Subscriber to perform this action.');
    }

    const amount = req.body.amount;
    const response = { paymentLink: null };

    try {
      const paymentData = await payment.createOrder(amount);
      const newPayment = new PaymentModel({
        referenceId: paymentData.reference,
        subscriber: decodedToken.subscriberId,
        amount: {
          value: amount,
          currencyCode: paymentData.currencyCode,
        },
        status: 'PENDING',
      });
      await newPayment.save();

      response.paymentLink = paymentData.paymentLink;

      return res.send(response);
    } catch (error) {
      console.error('Error processing payment:', error);
      return res.status(500).send({ error: error.message });
    }
  });

  app.use('/api/payment/hook', async (req, res) => {
    try {
      console.log('Webhook hit the backend');
      if (req.headers.secret !== process.env.PAYMENT_WEBHOOK_SECRET) {
        return res.status(401).send('Unauthorized');
      }

      const { eventName, order } = req.body;
      const status = eventName === 'PURCHASED' ? 'SUCCESS' : 'FAILED';

      const payment = await PaymentModel.findOneAndUpdate(
        { referenceId: order.reference },
        { status: status },
        { new: true }
      );

      console.log('Did the DB query');
      if (payment) {
        console.log('Found it in DB');
        if (status === 'SUCCESS') {
          await Subscriber.findByIdAndUpdate(payment.subscriber, {
            isPaid: true,
          });
        }
        console.log('Everything is fine sending the request');
        res.status(200).send('Success');
      } else {
        console.log('dd not found payment in DB');
        res.status(404).send('Payment not found');
      }
    } catch (error) {
      console.error('Error in payment webhook:', error);
      res.status(500).send({ error: 'Error processing payment webhook' });
    }
  });
};

export default PaymentAPI;

// TODO store status of winners
