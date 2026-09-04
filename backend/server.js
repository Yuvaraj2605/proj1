require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const http = require("http");
const { WebSocketServer } = require("ws");

const app = express();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// =========================
// WebSocket Connection
// =========================

wss.on("connection", (ws) => {
  console.log("Dashboard connected to WebSocket");

  ws.send(
    JSON.stringify({
      type: "connection",
      message: "Connected to NexusFlow real-time server"
    })
  );

  ws.on("close", () => {
    console.log("Dashboard disconnected");
  });
});

// =========================
// MongoDB Connection
// =========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// =========================
// User Schema
// =========================

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model("User", userSchema);
// =========================
// Alert Schema
// =========================

const alertSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true
  },
  parameter: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  severity: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Alert = mongoose.model("Alert", alertSchema);

// =========================
// Telemetry Schema
// =========================

const telemetrySchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  pressure: {
    type: Number,
    required: true
  },
  rpm: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Telemetry = mongoose.model("Telemetry", telemetrySchema);

// =========================
// Signup API
// =========================

app.post("/api/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: "Signup successful",
      user: newUser
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

// =========================
// Telemetry API
// =========================

app.post("/api/telemetry", async (req, res) => {
  try {
    const {
      deviceId,
      temperature,
      humidity,
      pressure,
      rpm
    } = req.body;

    if (
      !deviceId ||
      temperature === undefined ||
      humidity === undefined ||
      pressure === undefined ||
      rpm === undefined
    ) {
      return res.status(400).json({
        message: "All telemetry fields are required"
      });
    }

    const telemetry = new Telemetry({
      deviceId,
      temperature,
      humidity,
      pressure,
      rpm
    });

    await telemetry.save();
    // =========================
// Rule Engine
// =========================

let alertMessage = null;

if (temperature > 70) {
  alertMessage = {
    deviceId,
    parameter: "Temperature",
    value: temperature,
    threshold: 70,
    severity: "High",
    message: "Temperature exceeded safe limit"
  };
}

if (humidity > 75) {
  alertMessage = {
    deviceId,
    parameter: "Humidity",
    value: humidity,
    threshold: 75,
    severity: "High",
    message: "Humidity exceeded safe limit"
  };
}

if (rpm > 3500) {
  alertMessage = {
    deviceId,
    parameter: "RPM",
    value: rpm,
    threshold: 3500,
    severity: "High",
    message: "RPM exceeded safe limit"
  };
}

// Send telemetry to connected dashboards
wss.clients.forEach((client) => {

    // Send telemetry to connected dashboards
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(
          JSON.stringify({
            type: "telemetry",
            data: telemetry
          })
        );
      }
    });

    res.status(201).json({
      message: "Telemetry received",
      data: telemetry
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Telemetry server error"
    });
  }
});

// =========================
// Get Latest Telemetry
// =========================

app.get("/api/telemetry/latest", async (req, res) => {
  try {
    const latestTelemetry = await Telemetry
      .findOne()
      .sort({ timestamp: -1 });

    if (!latestTelemetry) {
      return res.status(404).json({
        message: "No telemetry data available"
      });
    }

    res.status(200).json(latestTelemetry);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching telemetry"
    });
  }
});

// =========================
// Login API
// =========================

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        fullName: user.fullName,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

// =========================
// Test Route
// =========================

app.get("/", (req, res) => {
  res.send("NexusFlow Backend is running!");
});

// =========================
// Start Server
// =========================

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});