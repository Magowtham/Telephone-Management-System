const UserModel = require("../../models/add_user_model");
const HostelModel = require("../../models/create_hostel_model");
const addUser = async (req, res) => {
  try {
    const { hostelName, rfid, cardid, name, rollNumber } = req.body;
    const [isRfidExists] = await UserModel.find({ rfid });
    if (isRfidExists) {
      return res.status(409).json({ rfid_error: "rfid already exists" });
    }
    const [isCardIdExists] = await UserModel.find({ card_id: cardid });
    if (isCardIdExists) {
      return res.status(409).json({ cardid_error: "card already exists" });
    }
    const [hostel] = await HostelModel.find({ name: hostelName });

    const newUser = new UserModel({
      rfid,
      card_id: cardid,
      hostel_id: hostel._id.toString(),
      name,
      roll_number: rollNumber,
    });
    await newUser.save();
    res.status(201).json({ message: "successfull" });
  } catch (error) {
    res.status(500).json({ error: "failed" });
  }
};

module.exports = addUser;
