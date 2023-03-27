const mongoose = require("mongoose");

const { Schema } = mongoose;

const authorSchema = new Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    avatar_url: { type: String, required: false },
    post: [{ type: Schema.Types.ObjectId, ref: "Post" }]
  },
  { timestamps: true }
);

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "Author" },
    likes: [{ type: Schema.Types.ObjectId, ref: "Author" }]
  },
  { timestamps: true }
);

const authorModel = mongoose.model("Author", authorSchema);
const postModel = mongoose.model("Post", postSchema);

module.exports = { authorModel, postModel };
