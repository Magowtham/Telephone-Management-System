const OtpModel = require("../../models/otp");
const validateOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const [isOtpExists] = await OtpModel.find({ otp });
    if (!isOtpExists) {
      return res.status(401).json({ error: "invalid otp" });
    }
    res.status(200).json({ emailId: isOtpExists.email });
  } catch (error) {
    res.status(500).json({ error: "unable to validate otp" });
  }
};

module.exports = validateOTP;
