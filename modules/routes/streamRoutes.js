const express = require("express");
const router = express.Router();
const {
    addNewVideoToPlaylist,
    deleteVideoById,
    getPlaylistByUser} = require("../controllers/streamController");

router.get("/:username", getPlaylistByUser);
router.post("/", addNewVideoToPlaylist);
router.delete("/:id", deleteVideoById);

module.exports = router;
