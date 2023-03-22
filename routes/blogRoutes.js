const express = require("express");
const router = express.Router();
const {
    getBlogById,
    addNewBlog,
} = require("../controllers/blogController");

router.get("/:userId", getBlogById);
router.post("/add", addNewBlog);


module.exports = router;
