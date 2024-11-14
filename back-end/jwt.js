import jwt from 'jsonwebtoken';
import { UserRole } from './utilities/userRoles.js';
import { isToday } from './utilities/dateValidators.js';

export const validateToken = token => {
  try {
    if (token === null) {
      return { decodedToken: null, isValid: false };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return { decodedToken: decoded, isValid: false };
    }

    return { decodedToken: decoded, isValid: true };
  } catch (error) {
    return { decodedToken: null, isValid: false };
  }
};

export const prepareAdminToken = user => {
  return jwt.sign(
    {
      userType: user.userRole,
      adminId: user._id,
      adminUserName: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1y' }
  );
};

export const prepareSubscriberToken = (subscriberDetails, winnerDetails) => {
  const areDetailsFilled = !(
    !subscriberDetails.name ||
    !subscriberDetails.email ||
    !subscriberDetails.address ||
    !subscriberDetails.emirateID
  );

  let collectionDataCollected = false;
  if (winnerDetails) {
    collectionDataCollected = !(
      !winnerDetails.collectionDate || !winnerDetails.collectionLocation
    );
  }

  return jwt.sign(
    {
      userType: UserRole.SUBSCRIBER,
      subscriberId: subscriberDetails._id,
      subsriberMobile: subscriberDetails.mobile,
      subscriberCountryCode: subscriberDetails.countryCode,
      lastScratchTime: subscriberDetails.lastScratchTime,
      areDetailsFilled: areDetailsFilled,
      isWon: isToday(winnerDetails),
      isPaidSubscriber: subscriberDetails.isPaid,
      collectionDataCollected: collectionDataCollected,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};
