const jwt = require("jsonwebtoken");

const jwtVerify = token => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (e) {
    return null;
  }
};

module.exports = {
  jwtVerify
};
