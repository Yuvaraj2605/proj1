const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();
mongoose.connect("YOUR_MONGODB_CONNECTION_STRING")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

app.use(express.json());
app.use(cors());
app.post("/api/signup", (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({
            message: "Please fill all fields"
        });
    }

    res.json({
        message: "Signup successful"
    });
});

app.get("/", (req, res) => {
    res.send("NexusFlow Backend is running!");
});


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});