import mongoose from 'mongoose';
import { UserRole } from '../utilities/userRoles.js';

const adminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.DISTRIBUTOR,
    required: true,
  },
});

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
