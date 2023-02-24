const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  deleteUser,
  getAllUsers
} = require("../controllers/userController");

router.get("/", getUsers);
router.get("/all", getAllUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);

module.exports = router;
