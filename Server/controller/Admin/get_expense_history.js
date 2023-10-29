const UserModel = require("../../models/add_user_model");
const getExpenseHistory = async (req, res) => {
  try {
    const { rfid, pageNumber, pageLimit } = req.query;
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
              `$expenseHistory`,
              parseInt(pageNumber * pageLimit),
              parseInt(pageLimit),
            ],
          },
          rechargeHistoryLength: {
            $size: "$expenseHistory",
          },
        },
      },
    ];
    const [rechargeHistoryResult] = await UserModel.aggregate(pipeLine);
    if (!rechargeHistoryResult) {
      return res.status(404).json({ error: "User Not Found" });
    }
    res.status(200).json({
      history: rechargeHistoryResult.historySlice,
      historyLength: rechargeHistoryResult.rechargeHistoryLength,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable To Fetch User Expense History" });
  }
};

module.exports = getExpenseHistory;
