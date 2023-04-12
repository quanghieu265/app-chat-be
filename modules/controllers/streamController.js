//package handle exceptions
const asyncHandler = require("express-async-handler");
// mongoose model
const {
  playlistModel,
  authorModel
} = require("../../mongoose/blogs-model/model");

const getPlaylistByUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const author = await authorModel.findOne({ username }).populate("playlist");
  if (author) {
    return res.status(200).json(author);
  } else {
    return res.status(400).json({ message: "User not found" });
  }
});

const addNewVideoToPlaylist = asyncHandler(async (req, res) => {
  const { title, description, videoUrl, thumbUrl } = req.body;
  const { username } = req.user;
  const author = await authorModel.findOne({ username });

  if (author) {
    const newVideo = await playlistModel.create({
      title,
      description,
      videoUrl,
      thumbUrl,
      author: author._id
    });
    if (newVideo) {
      author.playlist.push(newVideo);
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

const deleteVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;
  const video = await playlistModel.findOne({ _id: id }).populate("author");
  if (video && video.author.username === username) {
    await video.deleteOne({ _id: id });
    return res.status(200).json({ success: true });
  } else {
    return res.status(400).json({ message: "You can't delete this blog" });
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const video = await playlistModel.findOne({ _id: id }).populate("author");
  if (video) {
    return res.status(200).json(video);
  } else {
    return res.status(400).json({ message: "This video don't exist" });
  }
});

module.exports = {
  addNewVideoToPlaylist,
  deleteVideoById,
  getPlaylistByUser,
  getVideoById
};
