const AdminModel = require("../../models/admin_model");
const bcrypt = require("bcrypt");
const adminLogin = async (req, res) => {
  try {
    let { userName, password } = req.body;
    let reduction = false;
    const reductionStatus = userName.endsWith("alvas");
    if (reductionStatus) {
      reduction = true;
      userName = userName.slice(0, -5);
    }
    const [isAdminExists] = await AdminModel.find(
      { userName },
      { _id: 0, password: 1, userName: 1, email: 1 }
    );
    if (!isAdminExists) {
      return res.status(404).json({ error: "admin not found" });
    }
    bcrypt.compare(password, isAdminExists.password, (error, result) => {
      if (error) {
        throw error;
      }
      if (result) {
        res.status(200).json({ reductionStatus: reduction });
      } else {
        res.status(401).json({ error: "incorrect password" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "failed to login" });
  }
};

module.exports = adminLogin;
