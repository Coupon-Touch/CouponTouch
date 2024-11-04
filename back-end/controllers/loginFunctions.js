import { prepareAdminToken, prepareSubscriberToken } from '../jwt.js';
import { AdminUser } from '../models/adminUser.js';
import { Subscriber } from '../models/subscriber.js';
import bcrypt from 'bcryptjs';
import { addSubscriberController } from './csvFunctions.js';

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
    let subscriber = await Subscriber.findOne({
      mobile: phoneNumber,
      countryCode: countryCode,
    });

    if (!subscriber) {
      await addSubscriberController(
        {
          mobile: phoneNumber,
          countryCode: countryCode,
        },
        true
      );

      subscriber = await Subscriber.findOne({
        mobile: phoneNumber,
        countryCode: countryCode,
      });
    }

    const jwtToken = prepareSubscriberToken(null, null, subscriber);

    return {
      jwtToken: jwtToken,
      mobile: subscriber.mobile,
      countryCode: subscriber.countryCode,
      isPaid: subscriber.isPaid,
      lastScratchTime: subscriber.lastScratchTime
        ? subscriber.lastScratchTime.getTime()
        : null,
      address: subscriber.address,
      email: subscriber.email,
      emirateID: subscriber.emirateID,
      name: subscriber.name,
    };
  } catch (error) {
    console.log('Error in getSubscriberDetailsController:', error);
    return {
      isSubscriber: false,
      jwtToken: null,
      mobile: null,
      countryCode: null,
      isPaid: false,
      lastScratchTime: 0,
      address: null,
      email: null,
      emirateID: null,
      name: null,
    };
  }
};
