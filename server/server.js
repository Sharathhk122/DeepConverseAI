// server.js
import express from "express";
import cors from "cors";
import axios from "axios";
import * as dotenv from "dotenv";

// Load .env variables
dotenv.config();

const app = express();

// ✅ CORS setup (allow from any origin)
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
      console.log(`🔐 Trying API key: ${apiKey.slice(0, 8)}...`);

      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: "deepseek/deepseek-r1:free", // You can try "openai/gpt-3.5-turbo" to test
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

      const botReply = response.data?.choices?.[0]?.message?.content;

      if (botReply) {
        console.log("✅ Response received from OpenRouter");
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
        console.error("📦 API Error Data:", JSON.stringify(error.response.data, null, 2));
      }
      // Continue to next key
    }
  }

  // ❌ All API keys failed
  res.status(500).json({
    botMessage: {
      text: "Sorry, the service is currently unavailable. Please try again later.",
      sender: "bot"
    }
  });
});

// ✅ GET: Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// ✅ Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
