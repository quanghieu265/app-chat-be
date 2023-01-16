const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  deleteUser,
} = require("../controllers/userController");

router.get("/", getUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);

module.exports = router;
