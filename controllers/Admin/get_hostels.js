const HostelModel = require("../../models/create_hostel_model");
const RechargeModel = require("../../models/recharge_model");
const moment = require("moment");

const date = new Date();

const getHostels = async (req, res) => {
  try {
    const result = await HostelModel.find({});
    const currentDate = moment(
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
      "DD/MM/YYYY"
    ).toDate();
    const data = [];
    for (let i = 0; i < result.length; i++) {
      const pipeline = [
        {
          $match: {
            hostel_id: result[i]._id.toString(),
            date: {
              $gte: currentDate,
            },
          },
        },
        {
          $project: {
            amount: 1,
          },
        },
      ];

      const rechargeHistoryResult = await RechargeModel.aggregate(pipeline);
      const totalAmount = rechargeHistoryResult.reduce(
        (prevAmount, history) => prevAmount + Number(history.amount),
        0
      );
      data.push({
        id: result[i]._id.toString(),
        name: result[i].name,
        amount: totalAmount,
      });
    }
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: "failed to fetch hostel details" });
  }
};

module.exports = getHostels;
