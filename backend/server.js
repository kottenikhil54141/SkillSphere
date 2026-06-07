const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const gigRoutes = require("./routes/gigRoutes");
const proposalRoutes = require("./routes/proposalRoutes");
const chatRoutes = require("./routes/chatRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const { protect, authorizeRoles } = require("./middleware/authMiddleware");
const { initializeSocket } = require("./socket/socket");
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
initializeSocket(server);

app.get("/", (req, res) => {
  res.send("SkillSphere Backend Running");
});

app.use(cors());
app.use(express.json());
app.use("/api/notifications", notificationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);



app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "You reached a protected route", user: req.user });
});

app.get("/api/admin-only", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome admin" });
});

app.get("/api/freelancer-only", protect, authorizeRoles("freelancer"), (req, res) => {
  res.json({ message: "Welcome freelancer" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
