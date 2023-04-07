const pool = require("../db.js");
const asyncHandler = require("express-async-handler");
const { jwtVerify } = require("../utils/jwt.utils");

const authHandler = asyncHandler(async (req, res, next) => {
  const nonSecurePaths = ["/api/user/login"];
  if (nonSecurePaths.includes(req.path)) return next();
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
    // check access token is valid
    const payload = jwtVerify(token);
    if (payload) {
      const id = parseInt(payload.id);
      const user = await pool.query(
        "SELECT id,username,email FROM users WHERE id = $1",
        [id]
      );
      if (user.rows[0]) {
        req.user = user.rows[0];
        return next();
      } else {
        res.status(401);
        throw new Error("Invalid authorization");
      }
    }

    // check Refresh token is valid
    const { refreshToken } = req.cookies;
    const payloadRefreshToken = jwtVerify(refreshToken);
    if (payloadRefreshToken) {
      const id = parseInt(payloadRefreshToken.id);
      const user = await pool.query(
        "SELECT id,username,email FROM users WHERE id = $1",
        [id]
      );
      if (user.rows[0]) {
        req.user = user.rows[0];
        return next();
      } else {
        res.status(401);
        throw new Error("Invalid authorization");
      }
    }
    res.clearCookie("refreshToken");
    res.status(401);
    throw new Error("Invalid authorization");
  } else {
    res.status(401);
    throw new Error("No token provided");
  }
});

module.exports = { authHandler };
