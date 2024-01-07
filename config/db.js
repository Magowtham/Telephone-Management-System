const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MongoDB_URL, {
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
