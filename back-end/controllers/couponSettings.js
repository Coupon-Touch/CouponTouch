import { CouponSettings } from '../models/couponSettings.js';

export const storeCouponSettingsController = async (input, context) => {
  try {
    const newData = new CouponSettings({ albayan: input });
    await newData.save();
    return {
      isSuccessful: true,
      message: 'Data stored successfully',
    };
  } catch (error) {
    console.error('Error storing dynamic data:', error);
    return {
      isSuccessful: false,
      message: 'Failed to store data',
    };
  }
};

export const getLatestCouponSettingsAlbayanController = async () => {
  try {
    const latestEntry = await CouponSettings.findOne().sort({ createdAt: -1 });
    return latestEntry.albayan || {};
  } catch (error) {
    console.error('Error fetching latest coupon settings:', error);
    return {};
  }
};
