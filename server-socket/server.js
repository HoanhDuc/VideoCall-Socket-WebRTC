const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
// const server = http.createServer(function (req, res) {
//   fs.readFile(__dirname + '/index.html', function (err, data) {
//     res.writeHead(200);
//     res.end(data);
//   });
// });

const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000", "https://video-call-socket-web-rtc.vercel.app"],
    methods: ["GET"],
  },
});

// const activeUsers = new Set();

// io.on("connection", function (socket) {
//   console.log("Made socket connection");

//   socket.on("new user", function (data) {
//     socket.userId = data;
//     activeUsers.add(data);
//     io.emit("new user", [...activeUsers]);
//   });

//   socket.on("disconnect", () => {
//     activeUsers.delete(socket.userId);
//     io.emit("user disconnected", socket.userId);
//   });
// });

io.on("connection", (socket) => {
  socket.on("sendSocketId", () => {
    socket.emit("me", socket.id);
    // io.emit
  });

  socket.on("sendMineInfo", ({user}) => {
    socket.broadcast.emit('newConnection', user)
  });

  socket.on("imOnline", ({user}) => {
    socket.broadcast.emit('usersOnline', user)
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      user: data.user,
    });
  });
  socket.on("shareScreen", (data) => {
    io.to(data.userToCall).emit("shareScreen", {
      signal: data.signal,
      from: data.from,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", {
      signal: data.signal,
    });
  });

  socket.on("endCall", (id) => {
      io.to(id).emit("endCall");
  });
});

server.listen(5000, () => console.log("server is running on port 5000"));
