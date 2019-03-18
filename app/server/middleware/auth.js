const keys = require("../config/keys");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  // Check for token
  if (!token) {
    res.status(401).json({ error: "User is un authorized" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, keys.jwtSecret);
    // Add user from jwt payload
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Token is not valid" });
  }
};

module.exports = auth;