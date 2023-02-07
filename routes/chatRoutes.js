const express = require("express");
const router = express.Router();
const {
  addUserToChat,
  getCurrentChat,
  getMessageById,
  addNewMessage,
  deleteChatById,
  updateUserNoticeChatById,
} = require("../controllers/chatController");

router.get("/", getCurrentChat);
router.get("/message/:id", getMessageById);
router.post("/message", addNewMessage);
router.post("/addusers", addUserToChat);
router.put("/:chatid", updateUserNoticeChatById);
router.delete("/:id", deleteChatById);

module.exports = router;
