const UserModel = require("../../models/add_user_model");
const currentDate = require("../Others/current_date");
const sendGmail = require("../Others/send_gmail");
const recharge = async (req, res) => {
  try {
    const { rfid, amount, key } = req.body;
    if (process.env.POS_Key !== key) {
      return res.status(401).json({ error: "Invalid Key" });
    }
    const [isUserExists] = await UserModel.find(
      { rfid },
      { _id: 0, balance: 1 }
    );
    if (!isUserExists) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const { date, time } = currentDate();
    await UserModel.updateOne(
      { rfid },
      {
        $push: {
          rechargeHistory: {
            $each: [{ date, time, amount: Number(amount) }],
            $position: 0,
          },
        },
        $set: {
          balance: Number(isUserExists.balance) + Number(amount),
        },
      }
    );
    res.status(200).json({ message: "Recharge Successfull" });
  } catch (error) {
    await sendGmail(
      "magowtham7@gmail.com",
      null,
      `In recharge.js file ${error.name} was occurred due to ${error.message}`
    );
    return res.status(500).json({ error: "Server Error" });
  }
};

module.exports = recharge;
