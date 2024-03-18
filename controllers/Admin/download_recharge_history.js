const RechargeModel = require("../../models/recharge_model");
const UserModel = require("../../models/add_user_model");
const mongoose = require("mongoose");
const moment = require("moment");
const generatePDF = require("../Others/generate_pdf");
const downloadRechargeHistory = async (req, res) => {
  try {
    let { hostelId, hostelName, reductionStatus, startDate, endDate } =
      req.query;
    const usersHistory = [];
    let totalAmount = 0;
    startDate = moment(startDate, "DD/MM/YYYY").toDate();
    endDate = moment(endDate, "DD/MM/YYYY").toDate();
    const pipeline = [
      {
        $match: {
          hostel_id: hostelId,
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
          user_id: 1,
        },
      },
    ];

    const rechargeHistoryResult = await RechargeModel.aggregate(pipeline);
    rechargeHistoryResult.forEach((history) => {
      if (Number(reductionStatus)) {
        history.amount = Number(history.amount) - Number(history.amount) * 0.6;
      }
      let newHistory = true;
      usersHistory.forEach((element) => {
        if (element.user_id === history.user_id) {
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
      const _id = new mongoose.Types.ObjectId(usersHistory[i].user_id);
      const [dbResult] = await UserModel.find(
        { _id },
        { card_id: 1, roll_number: 1, _id: 0 }
      );
      usersHistory[i] = {
        cardId: dbResult.card_id,
        rollNumber: dbResult.roll_number,
        amount: usersHistory[i].amount,
      };
    }
    console.log(hostelName);
    generatePDF(hostelName, res, usersHistory, totalAmount);
  } catch (error) {
    res.status(500).json({ error: "unable download recharge history" });
  }
};

module.exports = downloadRechargeHistory;
