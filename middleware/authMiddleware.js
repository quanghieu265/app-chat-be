const pool = require("../db.js");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authHandler = asyncHandler(async (req, res, next) => {
  const nonSecurePaths = ["/api/user/login"];
  if (nonSecurePaths.includes(req.path)) return next();
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const id = parseInt(decoded.id);
      const user = await pool.query(
        "SELECT id,username,email FROM users WHERE id = $1",
        [id]
      );
      req.user = user.rows[0];
      next();
    } catch (err) {
      res.status(401);
      throw new Error("Invalid authorization");
    }
  } else {
    res.status(401);
    throw new Error("No token provided");
  }
});

module.exports = { authHandler };
