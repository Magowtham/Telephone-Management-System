const UserModel = require("../../models/add_user_model");
const AdminModel = require("../../models/admin_model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const editUser = async (req, res) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.params.id);
    const { name, rfid, rollNumber, userName, password } = req.body;
    const [isUserExsists] = await UserModel.find({ _id });
    if (!isUserExsists) {
      return res.status(404).json({ error: "user not found" });
    }
    const [isRfidExsists] = await UserModel.find({ rfid }, { _id: 1 });
    const searchId = isRfidExsists?._id.toString();
    if (searchId !== undefined && searchId !== req.params.id) {
      return res.status(409).json({ error: "RFID already exists" });
    }
    const [isAdminExists] = await AdminModel.find(
      { userName },
      { password: 1 }
    );
    if (!isAdminExists) {
      return res.status(404).json({ error: "admin not found" });
    }
    bcrypt.compare(password, isAdminExists.password, async (error, result) => {
      if (error) {
        throw error;
      }
      if (result) {
        await UserModel.updateOne(
          { _id },
          { $set: { name, rfid, rollNumber } }
        );
        res.status(200).json({ message: "user details updated successfully" });
      } else {
        res.status(401).json({ error: "incorrect password" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "unable to update user details" });
  }
};

module.exports = editUser;
