const UserModel = require("../../models/add_user_model");
const ExpenseModel=require("../../models/expense_model");
const RechargeModel=require("../../models/recharge_model");
const deleteUser = async (req, res) => {
  try {
    const {rfid } = req.body;
    const [isUserExsists] = await UserModel.find({ rfid},{_id:1});
    if (!isUserExsists) {
      return res.status(404).json({ error: "user not found" });
    }
    const userId=isUserExsists?._id.toString();
    const isUserRechargeHistoryDeleted=await RechargeModel.deleteMany({userId});
    const isUserExpenseHistoryDeleted=await ExpenseModel.deleteMany({userId});
    const isUserDeleted = await UserModel.deleteOne({ rfid });
    const totalUsers = await UserModel.countDocuments();
    if (isUserDeleted.acknowledged&&isUserRechargeHistoryDeleted.acknowledged&&isUserExpenseHistoryDeleted.acknowledged) {
      res.status(200).json({ message: "user deleted successfully" ,totalUsers});
    } else {
      res.status(500).json({ error: "unable to delete user" });
    }
  } catch (error) {
    res.status(500).json({ error: "unable to delete user" });
  }
};
module.exports = deleteUser;
