import { Subscriber } from '../models/subscriber.js';

export const updateLastScratchTimeController = async (
  phoneNumber,
  countryCode
) => {
  try {
    const subscriber = await Subscriber.findOne({
      mobile: phoneNumber,
      countryCode: countryCode,
    });

    if (!subscriber) {
      return {
        isSuccessful: false,
        message: 'Subscriber not found',
      };
    }

    const currentTime = new Date();
    subscriber.lastScratchTime = currentTime;

    await subscriber.save();

    return {
      isSuccessful: true,
      message: 'Last scratch time successfully updated',
    };
  } catch (error) {
    console.log('Error in updateLastScratchTimeController:', error);

    return {
      isSuccessful: false,
      message: 'Failed to update last scratch time',
    };
  }
};
