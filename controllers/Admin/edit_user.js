const UserModel = require("../../models/add_user_model");
const mongoose = require("mongoose");

const editUser = async (req, res) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.params.id);
    const { hostelName, rfid, cardid, name, rollNumber } = req.body;
    const [isUserExsists] = await UserModel.find({ _id });
    if (!isUserExsists) {
      return res.status(404).json({ error: "user not found" });
    }
    const [isRfidExsists] = await UserModel.find({ rfid }, { _id: 1 });
    let searchId = isRfidExsists?._id.toString();
    if (searchId !== undefined && searchId !== req.params.id) {
      return res.status(409).json({ rfid_error: "RFID already exists" });
    }
    const [isCardIdExists] = await UserModel.find({ card_id: cardid });
    searchId = isCardIdExists?._id.toString();
    if (searchId !== undefined && searchId !== req.params.id) {
      return res.status(409).json({ cardid_error: "CardID already exists" });
    }
    await UserModel.updateOne(
      { _id },
      { $set: { rfid, card_id: cardid, name, roll_number: rollNumber } }
    );
    res.status(200).json({ message: "user details updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "unable to update user details" });
  }
};

module.exports = editUser;
