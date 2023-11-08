const UserModel = require("../../models/add_user_model");
const AdminModel = require("../../models/admin_model");
const bcrypt = require("bcrypt");
const deleteUser = async (req, res) => {
  try {
    const { userName, rfid, password } = req.body;
    const [isUserExsists] = await UserModel.find({ rfid });
    if (!isUserExsists) {
      return res.status(404).json({ error: "user not found" });
    }
    const [isAdminExists] = await AdminModel.find(
      { userName },
      { password: 1 }
    );
    if (!isAdminExists) {
      return res.status(404).json({ error: "admin not found" });
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
            res.status(200).json({ message: "user deleted successfully" });
          } else {
            res.status(500).json({ error: "unable to delete user" });
          }
        } else {
          res.status(401).json({ error: "incorrect password" });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: "unable to delete user" });
  }
};
module.exports = deleteUser;
