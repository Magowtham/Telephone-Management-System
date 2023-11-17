const RechargeModel = require("../../models/recharge_model");
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
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $project: {
          amount: 1,
          _id: 0,
          userId: 1,
        },
      },
    ];
    const usersHistory = [];
    const rechargeHistoryResult = await RechargeModel.aggregate(pipeline);
    rechargeHistoryResult.forEach((history) => {
      console.log(history);
      usersHistory.forEach((element) => {
        if (element.userId === history.userId) {
          element.amount = Number(element.amount) + Number(history.amount);
        } else {
          usersHistory.push({
            userId: history.userId,
            amount: Number(history.amount),
          });
        }
      });
      if (usersHistory.length === 0) {
        usersHistory.push(history);
      }
    });
    console.log(usersHistory);
    // generatePDF(res, usersRechargeHistory, totalAmount.toFixed(1));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "unable download recharge history" });
  }
};

module.exports = downloadRechargeHistory;
