const UserModel = require("../../models/add_user_model");
const currentDate = require("../Others/current_date");
const sendGmail = require("../Others/send_gmail");
const startCall = async (req, res) => {
  try {
    const { rfid, key } = req.query;
    if ("alvas123" !== key) {
      return res.status(401).json({ error: "invalid key" });
    }
    const [isUserExists] = await UserModel.find(
      { rfid },
      { _id: 0, balance: 1, expenseHistory: { $slice: 1 } }
    );
    if (!isUserExists) {
      return res.status(404).json({ error: "user not found" });
    }
    const reductedAmount = isUserExists.expenseHistory[0]?.reductedAmount;
    if (reductedAmount === "pending") {
      return res.status(400).json({ error: "failed to start call" });
    }
    if (Number(isUserExists.balance) <= 10) {
      return res.status(402).json({ error: "insufficient balance" });
    }
    const { date, time } = currentDate();
    await UserModel.updateOne(
      { rfid },
      {
        $push: {
          expenseHistory: {
            $each: [
              {
                date: date,
                callStartTime: time,
                callEndTime: "pending",
                reductedAmount: "pending",
              },
            ],
            $position: 0,
          },
        },
      }
    );
    return res.status(200).json({ balance: isUserExists.balance });
  } catch (error) {
    await sendGmail(
      "magowtham7@gmail.com",
      null,
      `In start_call.js file ${error.name} was occurred due to ${error.message}`
    );
    res.status(500).json({ error: "server error" });
  }
};

module.exports = startCall;
