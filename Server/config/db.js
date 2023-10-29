const mongoose = require("mongoose");
const dburl = process.env.MongoDB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      writeConcern: { w: "majority" },
    });
    console.log("connected to MongoDB");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
