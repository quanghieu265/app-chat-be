//package handle exceptions
const asyncHandler = require("express-async-handler");
// mongoose model
const { postModel, authorModel } = require("../mongoose/blogs-model/model");

const getBlogById = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const author = await authorModel.findOne({ username }).populate("post");
  if (author) {
    return res.status(200).json(author);
  } else {
    return res.status(400).json({ message: "User not found" });
  }
});

const addNewBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const { username } = req.user;
  const author = await authorModel.findOne({ username });

  if (author) {
    const newBlog = await postModel.create({
      title,
      content,
      author: author._id
    });
    if (newBlog) {
      author.post.push(newBlog);
      author
        .save()
        .then(result => {
          return res.status(200).json(result);
        })
        .catch(err => {
          return res.status(400).json({ err });
        });
    }
  } else {
    return res.status(400).json({ message: "User not found" });
  }
});

const deleteBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;
  const blog = await postModel.findOne({ _id: id }).populate("author");
  if (blog && blog.author.username === username) {
    await blog.deleteOne({ _id: id });
    return res.status(200).json({ success: true });
  } else {
    return res.status(400).json({ message: "You can't delete this blog" });
  }
});

module.exports = {
  addNewBlog,
  getBlogById,
  deleteBlogById
};
