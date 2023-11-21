const RechargeModel = require("../../models/recharge_model");
const UserModel = require("../../models/add_user_model");
const mongoose = require("mongoose");
const moment = require("moment");
const generatePDF = require("../Others/generate_pdf");
const downloadRechargeHistory = async (req, res) => {
  try {
    let { reductionStatus, startDate, endDate } = req.query;
    const usersHistory = [];
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

    const rechargeHistoryResult = await RechargeModel.aggregate(pipeline);
    rechargeHistoryResult.forEach((history) => {
      if (reductionStatus) {
        history.amount = Number(history.amount) - Number(history.amount) * 0.6;
      }
      let newHistory = true;
      usersHistory.forEach((element) => {
        if (element.userId === history.userId) {
          element.amount = Number(element.amount) + Number(history.amount);
          newHistory = false;
        }
      });
      if (newHistory) {
        usersHistory.push(history);
      }
      totalAmount = totalAmount + Number(history.amount);
    });
    for (let i = 0; i < usersHistory.length; i++) {
      const _id = new mongoose.Types.ObjectId(usersHistory[i].userId);
      const [dbResult] = await UserModel.find(
        { _id },
        { rfid: 1, rollNumber: 1, _id: 0 }
      );
      usersHistory[i] = {
        rfid: dbResult.rfid,
        rollNumber: dbResult.rollNumber,
        amount: usersHistory[i].amount,
      };
    }

    generatePDF(res, usersHistory, totalAmount);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "unable download recharge history" });
  }
};

module.exports = downloadRechargeHistory;
