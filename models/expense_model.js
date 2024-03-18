const mongoose = require("mongoose");

const expenseHistorySchema = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  hostel_id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  call_start_time: {
    type: String,
    required: true,
  },
  call_end_time: {
    type: String,
    required: true,
  },
  reducted_amount: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("expense", expenseHistorySchema);
