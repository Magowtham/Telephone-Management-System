const UserModel = require("../../models/add_user_model");
const moment = require("moment");
const generatePDF = require("../Others/generate_pdf");
const downloadRechargeHistory = async (req, res) => {
  try {
    let { reductionStatus, startDate, endDate } = req.query;
    console.log(req.query);
    const usersRechargeHistory = [];
    let totalAmount = 0;
    startDate = moment(startDate, "DD/MM/YYYY").toDate();
    endDate = moment(endDate, "DD/MM/YYYY").toDate();
    const query = {
      rechargeHistory: {
        $elemMatch: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
    };
    const rechargeHistoryResult = await UserModel.find(query, {
      rfid: 1,
      rollNumber: 1,
      rechargeHistory: 1,
      _id: 0,
    });
    rechargeHistoryResult.forEach((user) => {
      const amount = user.rechargeHistory.reduce((sum, historyElement) => {
        return (
          sum +
          (Number(reductionStatus)
            ? historyElement.amount - historyElement.amount * 0.6
            : historyElement.amount)
        );
      }, 0);
      totalAmount += amount;
      usersRechargeHistory.push({
        rfid: user.rfid,
        rollNumber: user.rollNumber,
        amount: amount.toFixed(1),
      });
    });
    generatePDF(res, usersRechargeHistory, totalAmount.toFixed(1));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = downloadRechargeHistory;
