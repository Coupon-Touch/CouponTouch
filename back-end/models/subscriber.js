import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  emirateID: { type: String, default: '' },
  countryCode: { type: String, required: true },
  mobile: { type: String, required: true },
  isContacted: { type: Boolean, default: false },
  isPaid: { type: Boolean, default: false },
  lastScratchTime: { type: Date, default: null },
  wonDetails: {
    type: {
      collectionDate: { type: Date, default: null },
      collectionLocation: { type: String, default: '' },
      comments: { type: String, default: '' },
    },
    default: null,
  },
});

export const Subscriber = mongoose.model('Subscriber', subscriberSchema);
