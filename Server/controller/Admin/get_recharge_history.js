const UserModel = require("../../models/add_user_model");
const getRechargeHistory = async (req, res) => {
  try {
    const { rfid, pageNumber, pageLimit, reductionStatus } = req.query;
    const pipeLine = [
      {
        $match: {
          rfid,
        },
      },
      {
        $project: {
          _id: 0,
          historySlice: {
            $slice: [
              `$rechargeHistory`,
              parseInt(pageNumber * pageLimit),
              parseInt(pageLimit),
            ],
          },
          rechargeHistoryLength: {
            $size: "$rechargeHistory",
          },
        },
      },
    ];
    const [rechargeHistory] = await UserModel.aggregate(pipeLine);
    if (!rechargeHistory) {
      return res.status(404).json({ error: "User Not Found" });
    }
    if (Number(reductionStatus)) {
      rechargeHistory.historySlice.forEach((value) => {
        value.amount = Number(value.amount) - Number(value.amount) * 0.6;
      });
    }
    res.status(200).json({
      history: rechargeHistory.historySlice,
      historyLength: rechargeHistory.rechargeHistoryLength,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable To Fetch User Recharge History" });
  }
};

module.exports = getRechargeHistory;
