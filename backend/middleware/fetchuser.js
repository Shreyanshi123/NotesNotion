const jwt = require("jsonwebtoken");
const JWT_SECRET = "Life goes on- Like an echo in the forest";

const fetchuser = (req, res, next) => {
  // get the user from the jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).json({ error: "access denied" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "access denied" });
  }
};

module.exports = fetchuser;
