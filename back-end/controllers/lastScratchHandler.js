import { prepareSubscriberToken } from '../jwt.js';
import { Subscriber } from '../models/subscriber.js';
import { Winner } from '../models/winDetails.js';

export const updateLastScratchTimeController = async decodedToken => {
  try {
    const { subscriberId } = decodedToken;

    const subscriber = await Subscriber.findById(subscriberId);

    if (!subscriber) {
      return {
        isSuccessful: false,
        jwtToken: null,
        message: 'Subscriber not found',
      };
    }

    const currentTime = new Date();
    subscriber.lastScratchTime = currentTime;

    await subscriber.save();
    const winnerDetails = await Winner.findOne({
      subscriber: subscriber._id,
    }).sort({ winTime: -1 });
    const jwtToken = prepareSubscriberToken(subscriber, winnerDetails);

    return {
      isSuccessful: true,
      jwtToken: jwtToken,
      message: 'Last scratch time successfully updated',
    };
  } catch (error) {
    console.log('Error in updateLastScratchTimeController:', error);

    return {
      isSuccessful: false,
      jwtToken: null,
      message: 'Failed to update last scratch time',
    };
  }
};
