const UserModel = require("../../models/add_user_model");
const moment = require("moment");
const generatePDF = require("../Others/generate_pdf");
const downloadRechargeHistory = async (req, res) => {
  try {
    let { reductionStatus, startDate, endDate } = req.query;
    const usersRechargeHistory = [];
    let totalAmount = 0;
    startDate = moment(startDate, "DD/MM/YYYY").toDate();
    endDate = moment(endDate, "DD/MM/YYYY").toDate();
    const pipeline = [
      {
        $match: {
          "rechargeHistory.date": {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $project: {
          rfid: 1,
          rollNumber: 1,
          rechargeHistory: {
            $filter: {
              input: "$rechargeHistory",
              as: "rh",
              cond: {
                $and: [
                  { $gte: ["$$rh.date", startDate] },
                  { $lte: ["$$rh.date", endDate] },
                ],
              },
            },
          },
        },
      },
    ];
    const rechargeHistoryResult = await UserModel.aggregate(pipeline);
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
    res.status(500).json({ error: "unable download recharge history" });
  }
};

module.exports = downloadRechargeHistory;
