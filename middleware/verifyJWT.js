const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyJWT = (req, res, next) => {
  const authHeader = req.header("Authorization") || req.header("authorization");
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    // console.log(decoded);
    if (!decoded.UserInfo?.id)
      return res.status(403).json({ msg: "Invalid Token" }); //invalid token
    const user = User.findOne({ _id: decoded?.UserInfo?.id });
    if (!user) return res.status(403).json({ msg: "Invalid Token" }); //invalid token
    req.id = decoded.UserInfo.id;
    req.isAdmin = decoded.UserInfo.isAdmin;
    next();
  });
};

module.exports = verifyJWT;
