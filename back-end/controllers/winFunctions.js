import { Winner } from '../models/winDetails.js';
import { StatusEnum } from '../utilities/assignedStatus.js';
import { prepareSubscriberToken } from '../jwt.js';
import { isToday } from '../utilities/dateValidators.js';

export async function didSubscriberWinController(decodedToken) {
  try {
    const { subscriberId } = decodedToken;

    const winner = await Winner.findOne({ subscriber: subscriberId })
      .populate('subscriber')
      .sort({ winTime: -1 });

    if (!winner) {
      return {
        isWon: false,
        campaignCode: null,
        collectionDate: null,
        collectionLocation: '',
        comments: '',
        jwtToken: null,
      };
    }

    if (!isToday(winner)) {
      return {
        isWon: false,
        campaignCode: null,
        collectionDate: null,
        collectionLocation: '',
        comments: '',
        jwtToken: null,
      };
    }

    return {
      isWon: true,
      campaignCode: winner.campaignCode,
      collectionDate: winner.collectionDate,
      collectionLocation: winner.collectionLocation,
      comments: winner.comments,
      jwtToken: prepareSubscriberToken(winner.subscriber, winner),
    };
  } catch (error) {
    console.error('Error checking if subscriber won:', error);
    return {
      isWon: false,
      campaignCode: null,
      collectionDate: null,
      collectionLocation: '',
      comments: '',
      jwtToken: null,
    };
  }
}

export async function getAllWinnersController() {
  try {
    const winners = await Winner.find().populate('subscriber');
    return winners;
  } catch (error) {
    console.error('Error retrieving winners:', error);
    return [];
  }
}

export async function getAllWinsBySubscriberIDController(subscriberID) {
  try {
    const wins = await Winner.find({ subscriber: subscriberID }).populate(
      'subscriber'
    );

    return wins;
  } catch (error) {
    console.error('Error fetching winners by subscriber ID:', error);
    return [];
  }
}

export async function updateStatusofWinByWinnerIDController(
  winnerID,
  newStatus
) {
  try {
    if (!Object.values(StatusEnum).includes(newStatus)) {
      return {
        isSuccessful: false,
        message: 'Invalid status provided.',
      };
    }

    const winner = await Winner.findById(winnerID);

    if (!winner) {
      return {
        isSuccessful: false,
        message: 'Winner not found for the provided winner ID.',
      };
    }

    winner.status = newStatus;
    await winner.save();

    return {
      isSuccessful: true,
      message: 'Winner status updated successfully.',
    };
  } catch (error) {
    console.error('Error modifying winner status:', error);
    return {
      isSuccessful: false,
      message: 'An error occurred while updating the winner status.',
    };
  }
}
