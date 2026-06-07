const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", (gigId) => {
      socket.join(gigId);
      console.log(`Joined room: ${gigId}`);
    });

    socket.on("sendMessage", ({ gigId, message }) => {
      io.to(gigId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = { initializeSocket };
