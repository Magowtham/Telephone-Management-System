const mongoose = require("mongoose");
const UserModel = require("../../models/add_user_model");
const ExpenseModel = require("../../models/expense_model");
const currentDate = require("../Others/current_date");
const sendGmail = require("../Others/send_gmail");
const endCall = async (req, res) => {
  try {
    const { rfid, balance } = req.query;
    // if ("alvas123" !== key) {
    //   return res.status(401).json({ error: "ivalid key" });
    // }
    const [isUserExists] = await UserModel.find(
      { rfid },
      { _id: 1, balance: 1 }
    );
    if (!isUserExists) {
      return res.status(404).json({ error: "user not found" });
    }
    // if (reductedAmount !== "pending") {
    //   return res.status(400).json({ error: "call not started yet" });
    // }
    const { time } = currentDate();
    await ExpenseModel.updateOne(
      {
        $and: [
          { userId: isUserExists._id.toString() },
          { reductedAmount: "pending" },
        ],
      },
      {
        $set: {
          callEndTime: time,
          reductedAmount: Number(isUserExists.balance) - Number(balance),
        },
      }
    );
    await UserModel.updateOne(
      { rfid },
      {
        $set: {
          balance: Number(balance),
        },
      }
    );
    return res
      .status(200)
      .json({ message: "user balance updated successfully" });
  } catch (error) {
    console.log(error);
    await sendGmail(
      "magowtham7@gmail.com",
      null,
      `In end_call.js file ${error.name} was occurred due to ${error.message}`
    );
    res.status(500).json({ error: "server error" });
  }
};

module.exports = endCall;
