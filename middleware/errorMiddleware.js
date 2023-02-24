const errHandler = function (err, req, res, next) {
  const statusCode = res.statusCode || 400;
  res.status(statusCode).json({
    message: err.message,
    error: err,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

module.exports = { errHandler };
