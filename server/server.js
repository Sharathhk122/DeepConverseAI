import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

dotenv.config();

const app = express();

// Enable CORS for your frontend URL (replace with your Render frontend URL)
const allowedOrigins = [
  "http://localhost:3000",  // Local dev
  "https://deepconverseai-1.onrender.com",  // Your Render frontend URL
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

if (!OPENROUTER_API_KEY) {
  console.error("❌ OPENROUTER_API_KEY is missing!");
  process.exit(1);
}

// API endpoint
app.post("/api/get-bot-response", async (req, res) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: "User input is required." });
  }

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: "deepseek/deepseek-r1:free",
        messages: [{ role: "user", content: userInput }],
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://deepconverseai.onrender.com",  // Update with your Render backend URL
          "X-Title": "AI Chat App",
        },
        timeout: 30000,
      }
    );

    const botResponse = response.data.choices[0]?.message?.content || "Sorry, I couldn't process your request.";
    res.json({
      botMessage: {
        text: botResponse.replace(/<\/s>$/, ""),
        sender: "bot",
      },
    });
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({
      botMessage: {
        text: "⚠️ Sorry, the server encountered an error. Please try again.",
        sender: "bot",
      },
    });
  }
});

// Health check endpoint (required for Render)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
