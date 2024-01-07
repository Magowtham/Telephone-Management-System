const UserModel = require("../../models/add_user_model");
const mongoose = require("mongoose");

const editUser = async (req, res) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.params.id);
    const { name, rfid, rollNumber, } = req.body;
    const [isUserExsists] = await UserModel.find({ _id });
    if (!isUserExsists) {
      return res.status(404).json({ error: "user not found" });
    }
    const [isRfidExsists] = await UserModel.find({ rfid }, { _id: 1 });
    const searchId = isRfidExsists?._id.toString();
    if (searchId !== undefined && searchId !== req.params.id) {
      return res.status(409).json({ error: "RFID already exists" });
    }
    await UserModel.updateOne(
      { _id },
      { $set: { name, rfid, rollNumber } }
    );
    res.status(200).json({ message: "user details updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "unable to update user details" });
  }
};

module.exports = editUser;
