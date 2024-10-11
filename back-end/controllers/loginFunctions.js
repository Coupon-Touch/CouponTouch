import { prepareAdminToken } from '../jwt.js';
import { AdminUser } from '../models/adminUser.js';
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
