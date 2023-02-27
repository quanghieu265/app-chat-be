const pool = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//package handle exceptions
const asyncHandler = require("express-async-handler");

// Generate token
const generateToken = (payload, exp) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: exp });
};

// @desc Get all users
// @route GET /api/users
// @access Public
const getUsers = asyncHandler(async (req, res) => {
  const users = await pool.query(
    "SELECT id,username,email FROM users Where username!=$1",
    [req.user.username]
  );
  if (users.rows) {
    return res.status(200).json(users.rows);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await pool.query("SELECT id,username,email FROM users");
  if (users.rows) {
    return res.status(200).json(users.rows);
  }
});

// @desc Get user by id
const getUserById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);

  if (id) {
    const user = await pool.query(
      "SELECT id,username,email FROM users WHERE id = $1",
      [id]
    );
    return res.status(200).json(user.rows[0]);
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

// @desc Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (id) {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return res.status(200).json({ message: "User deleted" });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

// @desc Create a user
// @route POST /api/user/signup
// @access Public
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (username && password && email) {
    const user = await pool.query(
      "SELECT * FROM users WHERE username=$1 OR email=$2",
      [username, email]
    );
    if (user.rows[0]) {
      return res.status(400).json({ message: "User already exists" });
    }
    const currentTime = new Date();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await pool.query(
      "INSERT INTO users (username, email, password, created_on) VALUES($1,$2,$3,$4)",
      [username, email, hashedPassword, currentTime]
    );
    return res.status(201).json({ message: "success" });
  } else {
    res.status(400);
    throw new Error("Invalid username or password");
  }
});

// @desc login user
// @route POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const user = await pool.query("SELECT * FROM users WHERE username=$1", [
      username
    ]);
    if (user.rows[0]) {
      //check if  username and password are valid
      const isMatch = await bcrypt.compare(password, user.rows[0].password);
      if (isMatch) {
        const payload = {
          id: user.rows[0].id,
          username: user.rows[0].username,
          email: user.rows[0].email
        };
        const accessToken = generateToken(payload, "30m");
        const refreshToken = generateToken({ id: payload.id }, "7d");

        // Set refresh token cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
        });

        return res.status(200).json({
          ...payload,
          token: accessToken
        });
      } else {
        return res
          .status(404)
          .json({ message: "Invalid username or password" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } else {
    res.status(400);
    throw new Error("Invalid username or password");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "success" });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const payload = req.user;
  const accessToken = generateToken(payload, "30m");
  return res.status(200).json({
    ...payload,
    token: accessToken
  });
});

module.exports = {
  createUser,
  getUsers,
  getAllUsers,
  getUserById,
  deleteUser,
  loginUser,
  logoutUser,
  refreshAccessToken
};
