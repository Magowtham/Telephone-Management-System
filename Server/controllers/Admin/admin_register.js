const AdminModel = require("../../models/admin_model");
const bcrypt = require("bcrypt");
const adminRegister = async (req, res) => {
  try {
    const { userName, email, password, rootKey } = req.body;
    if ("edwinstuff" !== rootKey) {
      return res.status(401).json({ error: "invalid rootKey" });
    }
    const isAdminExists = await AdminModel.find({
      $or: [{ userName }, { email }],
    });
    if (isAdminExists.length !== 0) {
      return res.status(422).json({ error: "admin already exists" });
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
    return res.status(201).json({ message: "admin registration succcessfull" });
  } catch (error) {
    res.status(500).json({ error: "admin registration failed" });
  }
};

module.exports = adminRegister;
