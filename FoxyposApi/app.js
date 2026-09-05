const createError = require("http-errors");
const express = require("express");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const { Server } = require("socket.io");

require("dotenv").config();

// Keep compatibility with the existing local environment while allowing
// Render to use the clearer FRONTEND_URL variable.
const frontendUrl = process.env.FRONTEND_URL || process.env.PUBLIC_FRONTEND_URL;

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const menuRoutes = require("./routes/menuRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const stockRoutes = require ("./routes/stockRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: frontendUrl,
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Kitchen connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Kitchen disconnected");
  });
});

// =====================
// Middleware (GENERATOR STYLE)
// =====================
app.use(cors({
  origin: frontendUrl,
  credentials: true,
}));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// =====================
// Routes
// =====================
app.use("/", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/tables", require("./routes/tableRoutes"));
app.use("/api", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/dashboard", dashboardRoutes);
// =====================
// 404 handler
// =====================
app.use((req, res, next) => {
  next(createError(404));
});

// =====================
// error handler
// =====================
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {}
  });
});

module.exports = { app, server };
