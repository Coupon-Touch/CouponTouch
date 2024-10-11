import bcrypt from 'bcryptjs';

// Model Imports
import { AdminUser } from '../models/adminUser.js';

const createAdminUser = async () => {
  try {
    const hashedPassword = await bcrypt.hash('Tester@123', 10);

    const newAdmin = new AdminUser({
      username: 'albayanAdmin',
      password: hashedPassword,
    });

    await newAdmin.save();
    return { isSuccessful: true, message: 'Admin user created successfully' };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { isSuccessful: false, message: 'Admin user creation failed' };
  }
};

export async function initialDumpController(context) {
  const tasksToBeDone = [createAdminUser];
  for (const curTask of tasksToBeDone) {
    const taskResult = await curTask(context);
    if (taskResult.isSuccessful == false) {
      return taskResult;
    }
  }

  return {
    isSuccessful: true,
    message: 'Initial Dump Successful',
  };
}
