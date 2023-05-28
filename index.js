const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://jeevanandham5.github.io");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res, next) => {
  res.send("<h1>iam working :-)</h1>");
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://jeevanandham5.github.io",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected:${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User With Id:${socket.id} Joined Room:${data}`);
  });
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_massage", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnect", socket.id);
  });
});

// starting the server in port:3001
server.listen(process.env.PORT || 3001, () => {
  console.log("SERVER IS RUNNING");
});
