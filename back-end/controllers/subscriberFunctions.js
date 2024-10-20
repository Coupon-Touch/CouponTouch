import { Subscriber } from '../models/subscriber.js';

export const updateSubscriberController = async (
  mobile,
  countryCode,
  updateFields
) => {
  try {
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] === undefined) {
        delete updateFields[key];
      }
    });

    const updatedSubscriber = await Subscriber.findOneAndUpdate(
      { mobile, countryCode },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedSubscriber) {
      return {
        isSuccessful: false,
        message: 'Subscriber not found',
      };
    }

    return {
      isSuccessful: true,
      message: 'Subscriber updated successfully',
    };
  } catch (error) {
    console.error('Error updating subscriber:', error);
    return {
      isSuccessful: false,
      message: 'An error occurred while updating the subscriber',
    };
  }
};
