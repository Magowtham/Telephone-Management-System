const ExpenseModel = require("../../models/expense_model");
const getExpenseHistory = async (req, res) => {
  try {
    const { userId, pageNumber, pageLimit } = req.query;
    const history = await ExpenseModel.find({ userId }, { _id: 0, userId: 0 })
      .skip(pageNumber * pageLimit)
      .limit(pageLimit);
    const historyLength = await ExpenseModel.countDocuments({ userId });
    res.status(200).json({
      history,
      historyLength,
    });
  } catch (error) {
    res.status(500).json({ error: "unable to fetch user expense history" });
  }
};

module.exports = getExpenseHistory;
