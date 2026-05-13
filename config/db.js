const mongoose = require('mongoose');

let bucket;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    console.log('GridFS bucket ready');

    // Cleanup orphaned GridFS files whose File doc was already deleted
    const File = require('../models/File');
    const gridfsFiles = await bucket.find({}).toArray();
    for (const gf of gridfsFiles) {
      const exists = await File.findOne({ gridfsId: gf._id });
      if (!exists) {
        await bucket.delete(gf._id);
        console.log(`Cleaned up orphaned GridFS file: ${gf._id}`);
      }
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const getBucket = () => bucket;

module.exports = { connectDB, getBucket };
