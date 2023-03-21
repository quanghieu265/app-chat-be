const express = require("express");
const router = express.Router();

const {
  searchUsers,
  getUserById,
  deleteUser,
  getAllUsers,
  addUserToFriend
} = require("../controllers/userController");

router.get("/search", searchUsers);
router.get("/all", getAllUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.post("/add", addUserToFriend);


module.exports = router;
