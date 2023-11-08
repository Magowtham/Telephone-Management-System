const AdminModel = require("../../models/admin_model");
const OtpModel = require("../../models/otp");
const generateOtp = require("../Others/generate_otp");
const sendGmail = require("../Others/send_gmail");
async function clearOtp(otp) {
  try {
    await OtpModel.deleteOne({ otp });
  } catch (error) {
    throw error;
  }
}
const forgotPassword = async (req, res) => {
  try {
    const { userName } = req.body;
    const [isAdminExists] = await AdminModel.find(
      { userName },
      { email: 1, _id: 0 }
    );
    if (!isAdminExists) {
      return res.status(404).json({ error: "admin not found" });
    }
    const otp = generateOtp(5);
    const gmailStatus = await sendGmail(isAdminExists.email, otp);
    const OTP = new OtpModel({
      email: isAdminExists.email,
      otp,
    });
    await OTP.save();
    setTimeout(async () => {
      await clearOtp(otp);
    }, 3 * 60 * 1000);
    res.status(200).json({ message: gmailStatus });
  } catch (error) {
    res.status(500).json({ error: "unable to reset password" });
  }
};

module.exports = forgotPassword;
