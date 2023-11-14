const jwt = require("jsonwebtoken");
const cookieAuthoriser = (req, res, next) => {
  const token = req.cookies.token || null;
  if (!token) {
    return res.status(401).json({ error: "invalid token" });
  }
  jwt.verify(token, "alvas", (error, admin) => {
    if (error) {
      return res.status(401).json({ error: "invalid token" });
    }
    req.admin = admin;
    next();
  });
};
module.exports = cookieAuthoriser;
