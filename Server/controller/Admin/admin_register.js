const AdminModel = require("../../models/admin_model");
const bcrypt = require("bcrypt");
const adminRegister = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const isAdminExists = await AdminModel.find({
      $or: [{ userName }, { email }],
    });
    if (isAdminExists.length !== 0) {
      return res.status(422).json({ error: "Admin  Already Exists" });
    }
    await bcrypt.genSalt(10, (error, salt) => {
      if (error) {
        throw error;
      }
      bcrypt.hash(password, salt, async (error, hashedPassword) => {
        if (error) {
          throw error;
        }
        const newAdmin = new AdminModel({
          userName,
          email,
          password: hashedPassword,
        });
        await newAdmin.save();
      });
    });
    return res.status(201).json({ message: "Admin Registration Sucsessfull" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Admin Registration Process Failed" });
  }
};

module.exports = adminRegister;
