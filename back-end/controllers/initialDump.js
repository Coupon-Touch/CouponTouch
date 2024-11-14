import bcrypt from 'bcryptjs';

// Model Imports
import { AdminUser } from '../models/adminUser.js';
import { UserRole } from '../utilities/userRoles.js';

export const createAdminUser = async (username, password, role) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (UserRole[role] === undefined) {
      return { isSuccessful: false, message: 'Invalid role' };
    }
    const newAdmin = new AdminUser({
      username: username,
      password: hashedPassword,
      userRole: UserRole[role],
    });
    await newAdmin.save();
    return { isSuccessful: true, message: 'Admin user created successfully' };
  } catch (error) {
    return { isSuccessful: false, message: 'Admin user already exists' };
  }
};
export const updateAdminUser = async (id, password, role) => {
  try {
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    if (role && UserRole[role] === undefined) {
      return { isSuccessful: false, message: 'Invalid role' };
    }
    const updatedAdmin = await AdminUser.findOne({
      _id: id,
    });
    if (!updatedAdmin) {
      return { isSuccessful: false, message: 'Admin user not found' };
    }
    if (role) {
      updatedAdmin.userRole = UserRole[role];
    }
    if (hashedPassword) {
      updatedAdmin.password = hashedPassword;
    }
    await updatedAdmin.save();
    return { isSuccessful: true, message: 'User details updated successfully' };
  } catch (error) {
    return { isSuccessful: false, message: "Can't Update User" };
  }
};

export const deleteAdminUser = async id => {
  try {
    const deletedAdmin = await AdminUser.findOneAndDelete({
      _id: id,
    });
    if (!deletedAdmin) {
      return { isSuccessful: false, message: 'Admin user not found' };
    }
    return { isSuccessful: true, message: 'Admin user deleted successfully' };
  } catch (error) {
    return { isSuccessful: false, message: 'Error Deleting Admin User' };
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
