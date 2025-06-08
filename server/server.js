import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

// Load environment variables
dotenv.config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: '*' // or specify your client's origin
}));

app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "your-default-key";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Add a root route for testing
app.get("/", (req, res) => {
  res.send("AI Server is running");
});

app.post("/get-bot-response", async (req, res) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: "userInput is required" });
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
      "HTTP-Referer": "https://deepconverseai-8.onrender.com",  // Required by OpenRouter
      "X-Title": "DeepConverseAI-8"        // Required by OpenRouter
    },
    timeout: 30000
  }
);

    res.json({ 
      botMessage: {
        text: response.data.choices[0].message.content,
        sender: "bot"
      }
    });

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      error: "Failed to get bot response",
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
