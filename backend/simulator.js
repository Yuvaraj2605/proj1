const axios = require("axios");

const API_URL = "http://localhost:5000/api/telemetry";

function generateTelemetry() {
    return {
        deviceId: "TEMP-001",

        temperature: Number((20 + Math.random() * 70).toFixed(2)),

        humidity: Number((30 + Math.random() * 50).toFixed(2)),

        pressure: Number((10 + Math.random() * 5).toFixed(2)),

        rpm: Math.floor(1000 + Math.random() * 3000)
    };
}

async function sendTelemetry() {
    const data = generateTelemetry();

    try {
        const response = await axios.post(API_URL, data);

        console.log("Telemetry sent:", response.data.data);
    } catch (error) {
        console.log(
            "Error sending telemetry:",
            error.response?.data || error.message
        );
    }
}

console.log("NexusFlow IoT Simulator started...");

// Send data immediately
sendTelemetry();

// Send new data every 5 seconds
setInterval(sendTelemetry, 5000);