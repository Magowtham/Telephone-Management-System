const { constants } = require("fs/promises");
const UserModel = require("../../models/add_user_model");
const addUser = async (req, res) => {
  try {
    const { name, rfid, rollNumber } = req.body;
    const [isAlreadyUserExists] = await UserModel.find({ rfid });
    if (isAlreadyUserExists) {
      return res.status(409).json({ error: "User Already Exists" });
    }
    const newUser = new UserModel({ name, rfid, rollNumber });
    await newUser.save();
    res.status(201).json({ message: "Registration Successfull" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Registration Failed" });
  }
};

module.exports = addUser;
