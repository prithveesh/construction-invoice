const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb+srv://prithveesh:0Ccdi4G4uTBIfC4O@cluster0.bl76y.gcp.mongodb.net/?retryWrites=true&w=majority',
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
