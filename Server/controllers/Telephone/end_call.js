const UserModel = require("../../models/add_user_model");
const currentDate = require("../Others/current_date");
const sendGmail = require("../Others/send_gmail");
const endCall = async (req, res) => {
  try {
    const { rfid, balance, key } = req.body;
    if ("alvas123" !== key) {
      return res.status(401).json({ error: "ivalid key" });
    }
    const [isUserExists] = await UserModel.find(
      { rfid },
      { _id: 0, balance: 1, expenseHistory: { $slice: 1 } }
    );
    if (!isUserExists) {
      return res.status(404).json({ error: "user not found" });
    }
    const reductedAmount = isUserExists.expenseHistory[0]?.reductedAmount;
    if (reductedAmount !== "pending") {
      return res.status(400).json({ error: "call not started yet" });
    }
    const { time } = currentDate();
    await UserModel.updateOne(
      { rfid },
      {
        $set: {
          [`expenseHistory.0.callEndTime`]: time,
          [`expenseHistory.0.reductedAmount`]:
            Number(isUserExists.balance) - Number(balance),
          balance: Number(balance),
        },
      }
    );
    return res
      .status(200)
      .json({ message: "user balance updated successfully" });
  } catch (error) {
    await sendGmail(
      "magowtham7@gmail.com",
      null,
      `In end_call.js file ${error.name} was occurred due to ${error.message}`
    );
    res.status(500).json({ error: "server error" });
  }
};

module.exports = endCall;
