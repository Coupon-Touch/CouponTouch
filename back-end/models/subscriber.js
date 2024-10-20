import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  emirateID: { type: String, default: '' },
  countryCode: { type: String, required: true },
  mobile: { type: String, required: true },
  comment: { type: String, default: '' },
  isContacted: { type: Boolean, default: false },
  isPaid: { type: Boolean, default: false },
  lastScratchTime: { type: Date, default: null },
});

export const Subscriber = mongoose.model('Subscriber', subscriberSchema);
