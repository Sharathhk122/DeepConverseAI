// server.js
import express from "express";
import cors from "cors";
import axios from "axios";
import * as dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const app = express();

// CORS config
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));

// Enable JSON body parsing
app.use(express.json());

// OpenRouter endpoint
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Load API keys
const API_KEYS = process.env.OPENROUTER_API_KEYS
  ? process.env.OPENROUTER_API_KEYS.split(",")
  : [];

if (API_KEYS.length === 0) {
  console.warn("⚠️ No API keys configured. Please set OPENROUTER_API_KEYS in Render or .env.");
}

// POST /api/get-bot-response
app.post("/api/get-bot-response", async (req, res) => {
  const { userInput } = req.body;

  console.log("📨 Incoming:", userInput);

  if (!userInput || typeof userInput !== "string") {
    return res.status(400).json({
      error: "userInput is required and must be a string",
      botMessage: {
        text: "Please enter a message.",
        sender: "bot"
      }
    });
  }

  for (const apiKey of API_KEYS) {
    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: "deepseek/deepseek-r1:free", // You can replace this with another model
          messages: [{ role: "user", content: userInput }]
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

      const reply = response.data?.choices?.[0]?.message?.content;

      if (reply) {
        return res.json({
          botMessage: {
            text: reply,
            sender: "bot"
          }
        });
      }

    } catch (err) {
      console.error(`❌ Key ${apiKey.slice(0, 5)} failed:`, err.message);
    }
  }

  return res.status(500).json({
    botMessage: {
      text: "Service unavailable. Please try again later.",
      sender: "bot"
    }
  });
});

// GET: Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// GET: Root route (optional)
app.get("/", (req, res) => {
  res.send("✅ DeepConverse AI backend is live.");
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port http://localhost:${PORT}`);
});
