const UserModel = require("../../models/add_user_model");
const AdminModel = require("../../models/admin_model");
const bcrypt = require("bcrypt");
const deleteUser = async (req, res) => {
  try {
    const { userName, rfid, password } = req.body;
    const [isUserExsists] = await UserModel.find({ rfid });
    if (!isUserExsists) {
      return res.status(404).json({ error: "User Not Found" });
    }
    const [isAdminExists] = await AdminModel.find(
      { userName },
      { password: 1 }
    );
    if (!isAdminExists) {
      return res.status(404).json({ error: "Admin Not Found" });
    }
    await bcrypt.compare(
      password,
      isAdminExists.password,
      async (error, result) => {
        if (error) {
          throw error;
        }
        if (result) {
          const isUserDeleted = await UserModel.deleteOne({ rfid });
          if (isUserDeleted.acknowledged) {
            res.status(200).json({ message: "User Successfully Deleted" });
          } else {
            res.status(500).json({ error: "Unbale To Delete User" });
          }
        } else {
          res.status(401).json({ error: "Incorrect Password" });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Unbale To Delete User" });
  }
};
module.exports = deleteUser;
