import mongoose from 'mongoose';

const couponSettingsSchema = new mongoose.Schema(
  {
    albayan: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CouponSettings = mongoose.model(
  'CouponSettings',
  couponSettingsSchema
);
