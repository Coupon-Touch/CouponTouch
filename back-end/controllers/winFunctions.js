import { Winner } from '../models/winDetails.js';
import { prepareSubscriberToken } from '../jwt.js';

export async function didSubscriberWinController(decodedToken) {
  try {
    const { subscriberId } = decodedToken;

    const winner = await Winner.findOne({ subscriber: subscriberId });

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

    return {
      isWon: true,
      campaignCode: winner.campaignCode,
      collectionDate: winner.collectionDate,
      collectionLocation: winner.collectionLocation,
      comments: winner.comments,
      jwtToken: prepareSubscriberToken(null, decodedToken, true, winner),
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
