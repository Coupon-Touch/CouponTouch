import mongoose from 'mongoose';
const dbURI = process.env.MONGO_URI;

export async function connectToDatabase() {
  try {
    await mongoose.connect(dbURI);
    console.log('MongoDB connected successfully!');
    return true;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false;
  }
}
