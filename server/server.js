// server.js
import express from "express";
import cors from "cors";
import axios from "axios";
import * as dotenv from "dotenv";

// Load .env variables
dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: "*", // You can restrict to specific frontend domain in production
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));

// Middleware
app.use(express.json());

// API configuration
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Get API keys from environment variable (comma-separated)
const API_KEYS = process.env.OPENROUTER_API_KEYS
  ? process.env.OPENROUTER_API_KEYS.split(",")
  : [];

if (API_KEYS.length === 0) {
  console.warn("⚠️ No API keys configured. Please set OPENROUTER_API_KEYS in .env");
}

// POST: Get bot response
app.post("/api/get-bot-response", async (req, res) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({
      error: "User input is required",
      botMessage: {
        text: "Please provide a message to continue.",
        sender: "bot"
      }
    });
  }

  for (const apiKey of API_KEYS) {
    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: "deepseek/deepseek-r1:free",
          messages: [{ role: "user", content: userInput }],
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://deepconverseai.onrender.com",
            "X-Title": "DeepConverse AI"
          },
          timeout: 30000
        }
      );

      const botReply = response.data.choices?.[0]?.message?.content;
      if (botReply) {
        return res.json({
          botMessage: {
            text: botReply,
            sender: "bot"
          }
        });
      }
    } catch (error) {
      console.error(`❌ API Error with key ${apiKey.slice(0, 5)}...:`, error.message);
      if (error.response?.data) console.error("Response:", error.response.data);
      // Try next key if available
    }
  }

  // If all keys failed
  res.status(500).json({
    botMessage: {
      text: "Sorry, the service is currently unavailable. Please try again later.",
      sender: "bot"
    }
  });
});

// GET: Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
