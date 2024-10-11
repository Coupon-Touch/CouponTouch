import mongoose from 'mongoose';

/**
 * prospect - Data provided but hasn't paid or hasn't been contacted or has decided to not take subscription when contacted by support
 * subsrciber = Data provided and paid.
 * 
 userID - mongoID (auto generated)
 password - string
 accessLevel - int
  // 0 = Admin (generate QR, bias, add bulk subsrciber, add single subsrciber)
  // 1 = Dispatcher (can see subscribers who won the prize, assign subscribers task to himself)
  // 2 = Support (will call the prospect and ask for payment and confirm their subscription).
  companyName - string

*/

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
});

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
