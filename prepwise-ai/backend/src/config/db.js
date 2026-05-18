const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prepwiseai', {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Local MongoDB connection failed: ${error.message}`);
    console.log(`Starting an In-Memory MongoDB Server as a fallback...`);
    
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected successfully: ${mongoUri}`);
    } catch (fallbackError) {
      console.error(`In-Memory MongoDB failed to start: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
