require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// User Schema
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

// User Model
const User = mongoose.model("User", userSchema);
// Telemetry Schema
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

// Telemetry Model
const Telemetry = mongoose.model("Telemetry", telemetrySchema);
// Signup API
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

// Telemetry API
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
// Get latest telemetry
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
// Login API
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

// Test route
app.get("/", (req, res) => {
  res.send("NexusFlow Backend is running!");
});

// Server
const PORT = 5000;

app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});
