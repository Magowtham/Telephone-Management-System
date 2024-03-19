const jwt = require("jsonwebtoken");
const autoLogin = (req, res) => {
  const token = req.header("Authorisation")?.split(" ")[1];
  jwt.verify(token, "spp", (err, user) => {
    if (err) {
      return res.status(401).json({ error: "invalid token" });
    }
    res.status(200).json({ reductionStatus: user.reductionStatus });
  });
};

module.exports = autoLogin;
