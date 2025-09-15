const { io } = require("socket.io-client");

// connect to your backend (adjust port if needed)
const socket = io("http://localhost:8000");

socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);

  // join a project room
  socket.emit("joinRoom", "12345projectId");  

  // send a test message
  socket.emit("sendMessage", {
    projectId: "12345projectId",
    senderId: "67890userId",
    text: "Hello from test client!",
  });
});

// listen for new messages
socket.on("newMessage", (msg) => {
  console.log("📩 New message received:", msg);
});
