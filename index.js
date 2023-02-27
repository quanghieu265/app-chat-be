const express = require("express");
const fs = require("fs");
const path = require("path");

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
} = require("./controllers/userController");
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
app.use("/api/todo", require("./routes/todoRoutes"));
//user routes
app.use("/api/user", require("./routes/userRoutes"));
//chat routes
app.use("/api/chat", require("./routes/chatRoutes"));

// catch 404 and forward to error handler
app.use(errHandler);

app.get("/video/:id", (req, res) => {
  const path = `assets/video/${req.params.id}.ts`;
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4"
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4"
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

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
});

io.of("/").adapter.on("join-room", (room, id) => {
  // console.log(`socket ${id} has joined room ${room}`);
});

//LISSTENERS
server.listen(port, () => {
  console.log(`server listening on port: ${port}`);
});
