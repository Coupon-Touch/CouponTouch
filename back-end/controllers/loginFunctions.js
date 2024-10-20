import { prepareAdminToken, prepareSubscriberToken } from '../jwt.js';
import { AdminUser } from '../models/adminUser.js';
import { Subscriber } from '../models/subscriber.js';
import bcrypt from 'bcryptjs';

export async function adminLoginController(args, context) {
  try {
    const { username, password } = args;
    const user = await AdminUser.findOne({ username });

    if (!user) {
      return { isSuccessful: false, message: 'Invalid login', jwtToken: null };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        isSuccessful: false,
        message: 'Invalid login',
        jwtToken: null,
      };
    }

    const token = prepareAdminToken(user);
    return { isSuccessful: true, message: 'Login successful', jwtToken: token };
  } catch (error) {
    console.error('Error during login:', error);
    return {
      isSuccessful: false,
      message: 'Invalid login',
      jwtToken: null,
    };
  }
}

export const getSubscriberDetailsController = async (
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
        isSubscriber: false,
        jwtToken: null,
        lastScratchTime: null,
        timeLeftTillNextScratch: null,
      };
    }

    const jwtToken = prepareSubscriberToken(subscriber);

    const currentTime = new Date();
    const lastScratchTime = subscriber.lastScratchTime;

    let timeLeftTillNextScratch = 0;

    if (lastScratchTime) {
      const timeDifference = currentTime - lastScratchTime;
      const hoursLeft = 24 * 60 * 60 * 1000 - timeDifference;
      timeLeftTillNextScratch = Math.max(0, hoursLeft);
    } else {
      timeLeftTillNextScratch = 24 * 60 * 60 * 1000;
    }

    return {
      isSubscriber: true,
      jwtToken: jwtToken,
      lastScratchTime: lastScratchTime ? lastScratchTime.toISOString() : null,
      timeLeftTillNextScratch: timeLeftTillNextScratch,
    };
  } catch (error) {
    console.log('Error in getSubscriberDetailsController:', error);
    return {
      isSubscriber: false,
      jwtToken: null,
      lastScratchTime: null,
      timeLeftTillNextScratch: null,
    };
  }
};
