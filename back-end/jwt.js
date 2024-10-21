import jwt from 'jsonwebtoken';
import { UserRole } from './utilities/userRoles.js';

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
      userType: UserRole.ADMINUSER,
      adminId: user._id,
      adminUserName: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export const prepareSubscriberToken = subscriber => {
  let isSubscriber = true;
  if (
    subscriber.name === '' ||
    subscriber.name === null ||
    subscriber.email === '' ||
    subscriber.email === null ||
    subscriber.address === '' ||
    subscriber.address === null ||
    subscriber.emirateID === '' ||
    subscriber.emirateID === ''
  ) {
    isSubscriber = false;
  }
  return jwt.sign(
    {
      userType: UserRole.SUBSCRIBER,
      subscriberId: subscriber._id,
      subscriberName: subscriber.name,
      subsriberMobile: subscriber.mobile,
      subscriberCountryCode: subscriber.countryCode,
      lastScratchTime: subscriber.lastScratchTime.getTime(),
      isSubscriber: isSubscriber,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};
