const express = require("express");
require("dotenv").config({ path: __dirname + "/.env" });
const port = process.env.PORT || 5000;
const cors = require("cors");
const bodyParser = require("body-parser");
const { errHandler } = require("./MIDDLEWARE/errorMiddleware");
const { authHandler } = require("./MIDDLEWARE/authMiddleware");
const { createUser, loginUser } = require("./controllers/userController");
const http = require("http");
const app = express();

//SOCKET
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//ROUTES

//PUBLIC ROUTES
app.post("/api/user/signup", createUser);
app.post("/api/user/login", loginUser);

//AUTH ROUTES
//auth middleware
app.use(authHandler);
// todo-route
app.use("/api/todo", require("./routes/todoRoutes"));
//user routes
app.use("/api/user", require("./routes/userRoutes"));
//chat routes
app.use("/api/chat", require("./routes/chatRoutes"));

// catch 404 and forward to error handler
app.use(errHandler);

// SOCKET LISTENERS
io.on("connection", (socket) => {
  socket.on("setup-chat", (userId) => {
    socket.join(userId);
    socket.emit("connected-chat");
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("end-chat");
  });

  socket.on("send-message-to-server", (recievedMessage) => {
    socket
      .to(recievedMessage.chat_room_id.toString())
      .emit("send-message-to-client", recievedMessage);
  });

  socket.off("setup-chat", () => {
    socket.leave();
  });
});

io.of("/").adapter.on("join-room", (room, id) => {
  // console.log(`socket ${id} has joined room ${room}`);
});

//LISSTENERS
server.listen(port, () => {
  console.log("server listening on port: 5000");
});
