const express = require("express");
const router = express.Router();
const {
  addNewVideoToPlaylist,
  deleteVideoById,
  getPlaylistByUser,
  getVideoById
} = require("../controllers/streamController");

router.get("/:username", getPlaylistByUser);
router.get("/video/:id", getVideoById);
router.post("/", addNewVideoToPlaylist);
router.delete("/:id", deleteVideoById);

module.exports = router;
