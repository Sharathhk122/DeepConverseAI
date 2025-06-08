// server.js
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

// CORS configuration
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));
app.use(express.json());

// API configuration
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// This should be protected in production - for demo purposes only
const DEMO_API_KEYS = [
  "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",
  // Add backup keys if available
];

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

  // Try each API key until one works
  for (const apiKey of DEMO_API_KEYS) {
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

      return res.json({ 
        botMessage: { 
          text: response.data.choices[0].message.content, 
          sender: "bot" 
        } 
      });

    } catch (error) {
      console.error(`API Error with key ${apiKey.substring(0, 5)}...:`, error.message);
      // Continue to next key if this one fails
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

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
