const pool = require("../db");
//package handle exceptions
const asyncHandler = require("express-async-handler");
// mongoose model
const { postModel,authorModel } = require("../mongoose/blogs-model/model");

const getBlogById = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const myId = req.user.id;

  const newBlog = new postModel({
    _id: new mongoose.Types.ObjectId(),
    title,
    content
  });
  newBlog
    .save()
    .then(result => {
        authorModel.findOne({ username: review.username }, (err, user) => {
        if (user) {
          // The below two lines will add the newly saved review's
          // ObjectID to the the User's reviews array field
          user.reviews.push(review);
          user.save();
          res.json({ message: "Review created!" });
        }
      });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

const addNewBlog = asyncHandler(async (req, res) => {
  const userId = req.body.id;
  const myId = req.user.id;
});

module.exports = {
  addNewBlog,
  getBlogById
};
