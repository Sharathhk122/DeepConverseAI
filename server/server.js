import express from "express";
import cors from "cors";
import axios from "axios";
import * as dotenv from "dotenv";

// Load .env variables
dotenv.config();

const app = express();

// ✅ CORS setup (allow all)
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));

// ✅ Parse JSON request bodies
app.use(express.json());

// ✅ OpenRouter endpoint
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// ✅ Load API keys from environment
const API_KEYS = process.env.OPENROUTER_API_KEYS
  ? process.env.OPENROUTER_API_KEYS.split(",")
  : [];

if (API_KEYS.length === 0) {
  console.warn("⚠️ No API keys configured. Please set OPENROUTER_API_KEYS in .env or Render.");
}

// ✅ POST: Get bot response
app.post("/api/get-bot-response", async (req, res) => {
  const { userInput } = req.body;

  console.log("📨 Incoming request:", userInput);

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
          model: "openai/gpt-3.5-turbo", // Replace with other model if needed
          messages: [{ role: "user", content: userInput }]
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://deepconverseai.onrender.com", // Your frontend link
            "X-Title": "DeepConverse AI"
          },
          timeout: 30000
        }
      );

      const botReply = response.data?.choices?.[0]?.message?.content;

      if (botReply) {
        return res.json({
          botMessage: {
            text: botReply,
            sender: "bot"
          }
        });
      } else {
        console.error("⚠️ Response missing content.");
      }

    } catch (error) {
      console.error(`❌ Error with key ${apiKey.slice(0, 5)}...: ${error.message}`);
      if (error.response) {
        console.error("📦 API Error Response:", JSON.stringify(error.response.data, null, 2));
      } else {
        console.error("⚠️ Axios Error:", error);
      }
      // Try next key
    }
  }

  // All keys failed
  res.status(500).json({
    botMessage: {
      text: "Service unavailable. Please try again later.",
      sender: "bot"
    }
  });
});

// ✅ Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// ✅ Optional root route
app.get("/", (req, res) => {
  res.send("✅ DeepConverse AI backend is live.");
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
