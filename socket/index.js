const io = require("socket.io")(8000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let users = [];

function addUser(userId, socketId) {
  if (!users.some((user) => user.userId === userId))
    users.push({ userId, socketId });

  //   console.log("poerHouse");
  //   users.forEach((el) => {
  //     console.log(el.userId);
  //   });
}

function removeUser(socketId) {
  users = users.filter((el) => el.socketId !== socketId);

  //   users.forEach((el) => {
  //     console.log(el.userId);
  //   });
}

function getUser(userId) {
  //   users.forEach((el) => {
  //     console.log(`${el.userId} -- ${el.socketId}`);
  //   });
  return users.find((user) => user.userId === userId);
}

// console.log(io);
io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUser", users);
  });

  socket.on("sendMessage", ({ reciverId, message }) => {
    const reciver = getUser(reciverId);

    if (reciver) {
      io.to(reciver.socketId).emit("getMessage", message);
    }
  });

  socket.on("disconnect", (userId) => {
    // console.log("disconnected");
    removeUser(socket.id);
    io.emit("getUser", users);
  });
});
