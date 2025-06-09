import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env
dotenv.config();

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Get API key from environment
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error("❌ Missing OPENROUTER_API_KEY in .env");
  process.exit(1);
}

// API Route
app.post("/get-bot-response", async (req, res) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({
      error: "User input is required",
      botMessage: {
        text: "Please enter a message to continue.",
        sender: "bot"
      }
    });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1:free",
        messages: [{ role: "user", content: userInput }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://deepconverseai-13.onrender.com", // ✅ Update if needed
          "X-Title": "AI Chat App",
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    const botResponse = response.data.choices?.[0]?.message?.content || "No response from AI";

    res.json({
      botMessage: {
        text: botResponse,
        sender: "bot"
      }
    });

  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);

    const statusCode = error.response?.status || 500;
    const message = getErrorMessage(error);

    res.status(statusCode).json({
      error: "API request failed",
      botMessage: {
        text: message,
        sender: "bot"
      }
    });
  }
});

// Error message formatter
function getErrorMessage(error) {
  if (error.response?.status === 401) {
    return "Authentication failed. Please check the API key in your .env file.";
  }
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  return "Sorry, something went wrong. Try again later.";
}

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`==> Server running on port ${PORT}`);
  console.log("==> Your service is live 🎉");
});
