import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    referenceId: {
      type: String,
      required: true,
    },
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscriber',
      required: true,
    },
    amount: {
      value: {
        type: Number,
        required: true,
      },
      currencyCode: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'PENDING'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model('Payment', paymentSchema);
