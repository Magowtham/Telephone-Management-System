const mongoose = require("mongoose");

const hostel = mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("hostels", hostel);
