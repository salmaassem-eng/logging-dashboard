import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/logvault');
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('⚠️ Ensure your local MongoDB service is running (e.g., Run "net start MongoDB" in PowerShell as Administrator or start mongod).');
    process.exit(1);
  }
};

export default connectDB;
