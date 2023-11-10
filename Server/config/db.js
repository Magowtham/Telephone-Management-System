const mongoose = require("mongoose");
const DB_URL =
  "mongodb+srv://chirrp:chirrp@cluster1.wlyepas.mongodb.net/Telephone-Management-System?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL, {
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
