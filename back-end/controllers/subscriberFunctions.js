import { prepareSubscriberToken } from '../jwt.js';
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
        jwtToken: null,
        message: 'Subscriber not found',
      };
    }
    const jwtToken = prepareSubscriberToken(updatedSubscriber);
    return {
      isSuccessful: true,
      jwtToken: jwtToken,
      message: 'Subscriber updated successfully',
    };
  } catch (error) {
    console.error('Error updating subscriber:', error);
    return {
      isSuccessful: false,
      jwtToken: null,
      message: 'An error occurred while updating the subscriber',
    };
  }
};
