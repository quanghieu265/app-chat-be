const pool = require("../db");
//package handle exceptions
const asyncHandler = require("express-async-handler");

// @desc add user to chat
// @route POST /api/chat/adduser
// access private
const addUserToChat = asyncHandler(async (req, res) => {
  const userId = req.body.id;
  const myId = req.user.id;

  // check if user's chat already exists
  const chat = await pool.query(
    "SELECT * FROM chat_room WHERE $1 = ANY (users_id) AND $2 = ANY (users_id)",
    [userId, myId]
  );
  if (chat.rowCount > 0) {
    return res.status(400).json({ message: "user already exists" });
  } else {
    const users_id = [userId, myId];

    // create a new chat room
    const chat = await pool.query(
      "INSERT INTO chat_room (users_id, updated_at) VALUES($1, current_timestamp) RETURNING *",
      [users_id]
    );

    return res.status(200).json({ chat: chat.rows[0] });
  }
});

// @desc get current chat
// @route GET /api/chat/
// access private
const getCurrentChat = asyncHandler(async (req, res) => {
  const myId = req.user.id;
  const query = `SELECT a.users_id, a.id AS chat_id, b.content, u.username AS chat_name FROM chat_room a
    LEFT JOIN users u ON u.id = ANY(a.users_id) AND $1 != u.id
    LEFT JOIN message_list b ON a.last_message = b.id
    WHERE $1= ANY (a.users_id)`;
  const myChat = await pool.query(query, [myId]);
  return res.status(200).json(myChat.rows);
});

// @desc get current message
// @route GET /api/chat/message/:id
// access private
const getMessageById = asyncHandler(async (req, res) => {
  const myId = req.user.id;
  const chatId = req.params.id;
  const size = req.query.size;
  // check if user can access this message in chat room
  const isAccessible = await pool.query(
    "SELECT * FROM chat_room WHERE id = $1 AND $2 = ANY(users_id)",
    [chatId, myId]
  );
  if (isAccessible.rowCount > 0) {
    const message = await pool.query(
      "SELECT * FROM message_list WHERE chat_room_id = $1 ORDER BY id DESC LIMIT $2",
      [chatId, size]
    );
    const totalChat = await pool.query(
      "SELECT COUNT(id) FROM message_list WHERE $1= chat_room_id",
      [chatId]
    );
    return res
      .status(200)
      .json({ list: message.rows, total: totalChat.rows[0].count });
  } else {
    return res.status(400).json({ message: "You cannot access this message" });
  }
});

// @desc add new message
// @route post /api/chat/message
// access private
const addNewMessage = asyncHandler(async (req, res) => {
  const { chatId, message, usersId } = req.body;
  let senderId = req.user.id;
  let readerId = usersId.filter(id => id !== senderId)[0];
  let queryValues = "";
  message.forEach((item, index) => {
    queryValues += `(${senderId},${readerId},'${item.content}','${
      item.type
    }',${chatId},current_timestamp)${index !== message.length - 1 ? "," : " "}`;
  });
  const newMessageData = await pool.query(
    `INSERT INTO message_list(sender,reader,content,tag,chat_room_id, created_at) VALUES${queryValues} RETURNING *`
  );
  // update last message to chat room
  await pool.query(
    "UPDATE chat_room SET last_message = $1, updated_at = current_timestamp WHERE id = $2",
    [newMessageData.rows[newMessageData.rows.length - 1].id, chatId]
  );
  return res.status(200).json(newMessageData.rows);
});

// @desc delete chat by id
// @route delete /api/chat/:id
// access private
const deleteChatById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const myId = req.user.id;
  const isAccessible = await pool.query(
    "SELECT * FROM chat_room WHERE id = $1 AND $2 = ANY(users_id)",
    [id, myId]
  );
  if (isAccessible.rowCount > 0) {
    await pool.query("DELETE FROM chat_room where id = $1", [id]);
    return res.status(200).json({ message: "Delete successfully" });
  } else {
    return res.status(400).json({ message: "You cannot delete this chat" });
  }
});

const updateUserNoticeChatById = async (req, res) => {
  const { chatid } = req.params;
  const myId = req.user.id;
  const data = req.body;
};

const getFriendList = asyncHandler(async (req, res) => {
  const myId = req.user.id;
  // get infomation user in friends_id field
  const query =
    "SELECT id,email,username,friends_id FROM users u WHERE u.id = ANY(SELECT unnest(friends_id) FROM users WHERE id = $1 )";
  const friendsList = await pool.query(query, [myId]);
  return res.status(200).json(friendsList.rows);
});

module.exports = {
  addUserToChat,
  getCurrentChat,
  getMessageById,
  addNewMessage,
  deleteChatById,
  updateUserNoticeChatById,
  getFriendList
};
