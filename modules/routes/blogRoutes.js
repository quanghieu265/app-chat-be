const express = require("express");
const router = express.Router();
const {
    getBlogById,
    addNewBlog,
    deleteBlogById,
} = require("../controllers/blogController");

router.get("/:username", getBlogById);
router.post("/add", addNewBlog);
router.delete("/:id", deleteBlogById);


module.exports = router;
