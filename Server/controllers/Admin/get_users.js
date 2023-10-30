const UserModel = require("../../models/add_user_model");
const getUsers = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const pageLimit = parseInt(req.query.pageLimit) || 5;
    const users = await UserModel.find(
      {},
      { __v: 0, expenseHistory: 0, rechargeHistory: 0 }
    )
      .skip(pageNumber * pageLimit)
      .limit(pageLimit);
    const totalUsers = await UserModel.countDocuments();
    return res.status(200).json({ users, totalUsers });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed To Fetch Users" });
  }
};

module.exports = getUsers;
