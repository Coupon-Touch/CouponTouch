import bcrypt from 'bcryptjs';

// Model Imports
import { AdminUser } from '../models/adminUser.js';
import { UserRole } from '../utilities/userRoles.js';

export const createAdminUser = async (
  username,
  password,
  role,
  update = false
) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (UserRole[role] === undefined) {
      return { isSuccessful: false, message: 'Invalid role' };
    }

    let adminUser = await AdminUser.findOne({ username: username });
    if (adminUser) {
      if (update === false) {
        return { isSuccessful: false, message: 'Admin user already exists' };
      }
      adminUser.password = hashedPassword;
      adminUser.userRole = UserRole[role];
      await adminUser.save();
      return { isSuccessful: true, message: 'Admin user updated successfully' };
    } else {
      const newAdmin = new AdminUser({
        username: username,
        password: hashedPassword,
        userRole: UserRole[role],
      });
      await newAdmin.save();
      return { isSuccessful: true, message: 'Admin user created successfully' };
    }
  } catch (error) {
    console.error('Error creating/updating admin user:', error);
    return {
      isSuccessful: false,
      message: 'Admin user creation/update failed',
    };
  }
};

export const getAllAdminUsersController = async () => {
  const adminUsers = await AdminUser.find();
  return {
    isSuccessful: true,
    adminUsers: adminUsers,
    message: 'Admin users fetched successfully',
  };
};
export const adminUserExists = async username => {
  const adminUser = await AdminUser.findOne({ username: username });
  if (adminUser) {
    return true;
  } else {
    return false;
  }
};
export async function initialDumpController(context) {
  const tasksToBeDone = [createAdminUser];
  for (const curTask of tasksToBeDone) {
    const taskResult = await curTask('albayanAdmin', 'Tester@123', 'ADMINUSER');
    if (taskResult.isSuccessful == false) {
      return taskResult;
    }
  }

  return {
    isSuccessful: true,
    message: 'Initial Dump Successful',
  };
}
