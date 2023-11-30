const RechargeModel = require("../../models/recharge_model");
const getRechargeHistory = async (req, res) => {
  try {
    const { userId, pageNumber, pageLimit, reductionStatus } = req.query; 
    const history = await RechargeModel.find({ userId }, { _id: 0, userId: 0 })
      .skip(pageNumber * pageLimit)
      .limit(pageLimit);
    const historyLength = await RechargeModel.countDocuments({ userId });
    if (Number(reductionStatus)) {
      history.forEach((value) => {
        value.amount = Number(value.amount) - Number(value.amount) * 0.6;
      });
    }
    res.status(200).json({
      history,
      historyLength,
    });
  } catch (error) {
    res.status(500).json({ error: "unable to fetch user recharge history" });
  }
};

module.exports = getRechargeHistory;
