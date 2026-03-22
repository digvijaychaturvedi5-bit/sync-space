const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const codeRoutes = require("./routes/codeRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const messageRoutes = require("./routes/messageRoutes");
const fileRoutes = require("./routes/fileRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const { socketAuth } = require("./socket/socketAuth");
const { registerChatHandlers } = require("./socket/chatSocket");
const { registerCodeCollaborationHandlers } = require("./socket/codeCollaboration");
const { registerDeadlineHandlers } = require("./socket/deadlineSocket");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Sync Space API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/files", fileRoutes);

io.use(socketAuth);

io.on("connection", (socket) => {
  registerChatHandlers(io, socket);
  registerCodeCollaborationHandlers(io, socket);
});

registerDeadlineHandlers(io);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
