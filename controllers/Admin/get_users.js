const UserModel = require("../../models/add_user_model");
const getUsers = async (req, res) => {
  try {
    const hostelId = req.query.hostel_id;
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const pageLimit = parseInt(req.query.pageLimit) || 5;
    const users = await UserModel.find({ hostel_id: hostelId }, { __v: 0 })
      .skip(pageNumber * pageLimit)
      .limit(pageLimit);
    const totalUsers = await UserModel.countDocuments({ hostel_id: hostelId });
    return res.status(200).json({ users, totalUsers });
  } catch (error) {
    res.status(500).json({ error: "unable to fetch users" });
  }
};

module.exports = getUsers;
