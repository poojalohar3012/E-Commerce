const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const healthRoutes = require("./routes/health.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Third-party middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/health", healthRoutes);

// Global Error Handler (must be last)
app.use(errorHandler);

module.exports = app;