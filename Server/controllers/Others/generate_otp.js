const crypto = require("crypto");
const generateOtp = (length) => {
  const otp = crypto.randomInt(
    Math.pow(10, length - 1),
    Math.pow(10, length) - 1
  );
  return otp.toString();
};

module.exports = generateOtp;
