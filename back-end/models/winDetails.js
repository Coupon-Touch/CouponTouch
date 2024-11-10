import mongoose from 'mongoose';
import { StatusEnum } from '../utilities/assignedStatus.js';

const winnerSchema = new mongoose.Schema({
  winTime: { type: Date, default: Date.now },
  campaignCode: { type: String, default: null },
  collectionDate: { type: Date, default: null },
  collectionLocation: { type: String, default: '' },
  comments: { type: String, default: '' },
  subscriber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscriber',
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(StatusEnum),
    default: StatusEnum.UNASSIGNED,
  },
});

export const Winner = mongoose.model('Winner', winnerSchema);
