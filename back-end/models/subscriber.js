import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  emirateID: { type: String },
  mobile: { type: String, required: true },
  comment: { type: String, default: '' },
  isContacted: { type: Boolean, default: false },
  isPaid: { type: Boolean, default: false },
});

export const Subscriber = mongoose.model('Subscriber', subscriberSchema);
