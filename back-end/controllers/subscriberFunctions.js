import { prepareSubscriberToken } from '../jwt.js';
import { Subscriber } from '../models/subscriber.js';
import { Winner } from '../models/winDetails.js';
const campaignCodeCurrent = 'cam_1197502';

export const updateSubscriberController = async (
  decodedToken,
  updateFields
) => {
  try {
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] === undefined) {
        delete updateFields[key];
      }
    });

    const { subscriberId } = decodedToken;
    const subscriber = await Subscriber.findById(subscriberId);

    const updatedSubscriber = await Subscriber.findByIdAndUpdate(
      subscriberId,
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

    const winnerDetails = await Winner.findOne({
      subscriber: subscriber._id,
    }).sort({ winTime: -1 });
    const jwtToken = prepareSubscriberToken(updatedSubscriber, winnerDetails);
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

export const updateSubscriber = async (mobile, res) => {
  try {
    let subscriber = await Subscriber.findOne({
      countryCodeMobileNumber: mobile,
    });

    if (!subscriber) {
      return res.status(404);
    }

    const newWinner = new Winner({
      subscriber: subscriber._id,
      campaignCode: campaignCodeCurrent,
      winTime: Date.now(),
    });

    await newWinner.save();
    res.status(200);
  } catch (error) {
    console.error('Error updating subscriber data:', error);
    res.status(500);
  }
};

export const updateCollectionDetailsController = async (
  decodedToken,
  collectionDate,
  collectionLocation,
  comments
) => {
  try {
    const { subscriberId } = decodedToken;

    let winner = await Winner.findOne({ subscriber: subscriberId })
      .populate('subscriber')
      .sort({ winTime: -1 });

    if (!winner) {
      return { isSuccessful: false, message: 'Winner not found' };
    }

    winner.collectionDate = collectionDate;
    winner.collectionLocation = collectionLocation;
    winner.comments = comments;

    await winner.save();
    const jwtToken = prepareSubscriberToken(winner.subscriber, winner);
    return {
      isSuccessful: true,
      jwtToken: jwtToken,
      message: 'Collection details updated successfully',
    };
  } catch (error) {
    console.error('Error updating winner collection details:', error);
    return {
      isSuccessful: false,
      jwtToken: null,
      message: 'Failed to update collection details',
    };
  }
};
