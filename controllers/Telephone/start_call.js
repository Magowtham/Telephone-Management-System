const UserModel = require("../../models/add_user_model");
const ExpenseModel = require("../../models/expense_model");
const currentDate = require("../Others/current_date");
const sendGmail = require("../Others/send_gmail");
const startCall = async (req, res) => {
  try {
    const { rfid } = req.query;
    // if ("alvas123" !== key) {
    //   return res.status(401).json({ error: "invalid key" });
    // }
    const [isUserExists] = await UserModel.find(
      { rfid },
      { _id: 1, balance: 1 }
    );

    if (!isUserExists) {
      res.status(404);
      return res.end("Usn");
    }
    // if (reductedAmount === "pending") {
    //   return res.status(400).json({ error: "failed to start call" });
    // }
    if (Number(isUserExists.balance) <= 10) {
      return res.status(402).json({ error: "insufficient balance" });
    }
    const { date, time } = currentDate();
    const ExpenseHistory = new ExpenseModel({
      userId: isUserExists._id.toString(),
      date,
      callStartTime: time,
      callEndTime: "pending",
      reductedAmount: "pending",
    });
    await ExpenseHistory.save();
    res.status(200);
    return res.end(`Ub:${isUserExists.balance}`);
  } catch (error) {
    console.log(error);
    // await sendGmail(
    //   "magowtham7@gmail.com",
    //   null,
    //   `In start_call.js file ${error.name} was occurred due to ${error.message}`
    // );
    res.status(500).json({ error: "server error" });
  }
};

module.exports = startCall;
