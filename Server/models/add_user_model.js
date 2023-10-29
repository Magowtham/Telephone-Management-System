const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rfid: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  rechargeHistory: {
    type: Array,
    default: [],
  },
  expenseHistory: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("users", UserSchema);
