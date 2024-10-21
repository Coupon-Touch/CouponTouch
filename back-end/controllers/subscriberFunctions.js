import { prepareSubscriberToken } from '../jwt.js';
import { Subscriber } from '../models/subscriber.js';
const campaignCodeCurrent = 'cam_1197502';

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

export const updateSubscriber = async (mobile, res) => {
  try {
    let subscriber = await Subscriber.findOne({
      countryCodeMobileNumber: mobile,
    });

    if (!subscriber) {
      return res.status(404);
    }

    subscriber.wonDetails = {
      isWon: true,
      campaignCode: campaignCodeCurrent,
    };

    await subscriber.save();

    res.status(200);
  } catch (error) {
    console.error('Error updating subscriber data:', error);
    res.status(500);
  }
};

export const updateCollectionDetailsController = async (
  PhoneNumber,
  CountryCode,
  collectionDate,
  collectionLocation,
  comments
) => {
  try {
    let subscriber = await Subscriber.findOne({
      countryCode: CountryCode,
      mobile: PhoneNumber,
    });

    if (!subscriber) {
      return { isSuccessful: false, message: 'Subscriber not found' };
    }

    if (subscriber.wonDetails) {
      subscriber.wonDetails.collectionDate = collectionDate;
      subscriber.wonDetails.collectionLocation = collectionLocation;
      subscriber.wonDetails.comments = comments;
    } else {
      subscriber.wonDetails = {
        isWon: true,
        campaignCode: campaignCodeCurrent,
        collectionDate,
        collectionLocation,
        comments,
      };
    }

    await subscriber.save();

    return {
      isSuccessful: true,
      message: 'Collection details updated successfully',
    };
  } catch (error) {
    console.error('Error updating subscriber collection details:', error);
    return {
      isSuccessful: false,
      message: 'Failed to update collection details',
    };
  }
};
