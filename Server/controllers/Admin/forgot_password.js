const AdminModel = require("../../models/admin_model");
const OtpModel = require("../../models/otp");
const generateOtp = require("../Others/generate_otp");
const forgotPassword = async (req, res) => {
  try {
    const { userName } = req.body;
    const [isAdminExists] = await AdminModel.find(
      { userName },
      { email: 1, _id: 0 }
    );
    if (!isAdminExists) {
      return res.status(404).json({ error: "Admin Not Found" });
    }
    const otp = generateOtp(5);
    await OtpModel({
      email,
      otp,
      expirationTime: new Date(Date.now() + 3 * 60 * 1000),
    }).save();
    const gmailStatus = await sendGmail(isAdminExists.email, otp);
    res.status(200).json({ message: gmailStatus });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable To Forgot Password" });
  }
};

module.exports = forgotPassword;
