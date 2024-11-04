import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  emirateID: { type: String, default: '' },
  countryCode: { type: String, required: true },
  mobile: { type: String, required: true },
  countryCodeMobileNumber: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  lastScratchTime: { type: Date, default: null },
});

export const Subscriber = mongoose.model('Subscriber', subscriberSchema);
