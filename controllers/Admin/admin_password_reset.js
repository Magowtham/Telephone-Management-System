const AdminModel = require("../../models/admin_model");
const bcrypt = require("bcrypt");
const resetPassword = async (req, res) => {
  try {
    const { password, emailId } = req.body;
    bcrypt.genSalt(10, (error, salt) => {
      if (error) {
        throw error;
      }
      bcrypt.hash(password, salt, async (error, hash) => {
        if (error) {
          throw error;
        }
        const updateResult = await AdminModel.updateOne(
          { email: emailId },
          { $set: { password: hash } }
        );
        if (updateResult.acknowledged) {
          res
            .status(200)
            .json({ message: "admin password updated successfully" });
        } else {
          res
            .status(500)
            .json({ error: "unable to update the admin password" });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: "unable to update the admin password" });
  }
};

module.exports = resetPassword;
