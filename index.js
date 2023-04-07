const express = require("express");
const fs = require("fs");
const path = require("path");
// mongoose
const connectDB = require("./mongoose/db")
require("dotenv").config({ path: __dirname + "/.env" });
const port = process.env.PORT || 5000;
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { errHandler } = require("./middleware/errorMiddleware");
const { authHandler } = require("./middleware/authMiddleware");
const {
  createUser,
  loginUser,
  logoutUser,
  refreshAccessToken
} = require("./modules/controllers/userController");
const http = require("http");
const app = express();

//SOCKET
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true
  }
});

// MIDDLEWARE
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//ROUTES

//PUBLIC ROUTES
app.post("/api/user/signup", createUser);
app.post("/api/user/login", loginUser);
app.post("/api/user/logout", logoutUser);

//AUTH ROUTES
//auth middleware
app.use(authHandler);

// refresh access token
app.get("/api/user/refresh", refreshAccessToken);
// todo-route
app.use("/api/todo", require("./modules/routes/todoRoutes"));
//user routes
app.use("/api/user", require("./modules/routes/userRoutes"));
//chat routes
app.use("/api/chat", require("./modules/routes/chatRoutes"));
// blog routes
app.use("/api/blog", require("./modules/routes/blogRoutes"));
// blog routes
app.use("/api/playlist", require("./modules/routes/streamRoutes"));
// catch 404 and forward to error handler
app.use(errHandler);

// SOCKET LISTENERS
io.on("connection", socket => {
  socket.on("setup-chat", userId => {
    socket.join(userId);
    socket.emit("connected-chat");
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("end-chat");
  });

  socket.on("send-message-to-server", (id, receivedMessage) => {
    socket.to(id).emit("send-message-to-client", receivedMessage);
  });

  socket.off("setup-chat", () => {
    socket.leave();
  });

  socket.on("get-stream", id => {
    let data;
    try {
      data = fs.readFileSync(
        path.resolve("./asset/video", "./video" + id + ".ts")
      );
      socket.broadcast.emit("send-stream-to-client", data);
    } catch (err) {
      socket.broadcast.emit("send-stream-to-client", null);
    }
  });

  //video call socket
  socket.on("send-offer",(data)=>{
    socket.to(data.signalTo).emit("receive-offer", data);
  })
  socket.on("send-answer",(data)=>{
    socket.to(data.signalTo).emit("receive-answer", data);
  })
  socket.on("send-ice",(data)=>{
    socket.to(data.signalTo).emit("receive-ice", data.ice);
  })
  socket.on("send-ended",(data)=>{
    socket.to(data.signalTo).emit("receive-ended");
  })
});

io.of("/").adapter.on("join-room", (room, id) => {
  // console.log(`socket ${id} has joined room ${room}`);
});

connectDB()
//LISTENERS for request from client
server.listen(port, () => {
  console.log(`server listening on port: ${port}`);
});
