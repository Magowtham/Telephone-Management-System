const AdminModel = require("../../models/admin_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminLogin = async (req, res) => {
  try {
    let { userName, password } = req.body;
    console.log(userName);
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
      return res.status(404).json({ error: "Admin Not Found" });
    }
    bcrypt.compare(password, isAdminExists.password, (error, result) => {
      if (error) {
        throw error;
      }
      if (result) {
        const payload = {
          userName: isAdminExists.userName,
          email: isAdminExists.email,
        };
        const token = jwt.sign(payload, "alvas", { expiresIn: "24h" });
        const expireDate = new Date(Date.now() + 1 * 24 * 60 * 60);

        res
          .status(200)
          .cookie("token", token, { expires: expireDate, httpOnly: true })
          .json({ reduction });
      } else {
        res.status(401).json({ error: "Incorrect Password" });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed To Login" });
  }
};

module.exports = adminLogin;
