const UserModel = require("../../models/add_user_model");
const currentDate = require("../Others/current_date");
const sendGmail = require("../Others/send_gmail");
const endCall = async (req, res) => {
  try {
    const { rfid, balance, key } = req.body;
    if (process.env.Telephone_Key !== key) {
      return res.status(401).json({ error: "Invalid Key" });
    }
    const [isUserExists] = await UserModel.find(
      { rfid },
      { _id: 0, balance: 1, expenseHistory: { $slice: 1 } }
    );
    if (!isUserExists) {
      return res.status(404).json({ error: "User Not Found" });
    }
    const reductedAmount = isUserExists.expenseHistory[0]?.reductedAmount;
    if (reductedAmount !== "pending") {
      return res.status(400).json({ error: "Call Not Started Yet" });
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
      .json({ message: "User Balance Updated Sucessfully" });
  } catch (error) {
    await sendGmail(
      "magowtham7@gmail.com",
      null,
      `In end_call.js file ${error.name} was occurred due to ${error.message}`
    );
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = endCall;
