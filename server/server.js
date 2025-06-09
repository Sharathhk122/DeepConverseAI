import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

// OpenRouter API details
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Debug: Check if API key is loaded
if (!OPENROUTER_API_KEY) {
  console.error("❌ ERROR: OPENROUTER_API_KEY is missing! Check your .env file.");
  process.exit(1); // Exit the app if API key is missing
}

// Force IPv4 to prevent connection issues
process.env.NODE_OPTIONS = "--dns-result-order=ipv4first";

app.post("/get-bot-response", async (req, res) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: "❌ Error: userInput is required." });
  }

  try {
    // Request to OpenRouter API
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
          "HTTP-Referer": "http://localhost:4000", // Required by OpenRouter
          "X-Title": "AI Chat App" // Optional but recommended
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    // Send response to client
    res.json({ botMessage: { text: response.data.choices[0].message.content, sender: "bot" } });

  } catch (error) {
    console.error("❌ Error fetching response:", error.message);

    if (error.response) {
      console.error("❌ API Response:", error.response.data);
    }

    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || "⚠️ API request failed.",
      botMessage: {
        text: "Sorry, I couldn't process your request. Please try again later.",
        sender: "bot"
      }
    });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ AI server started on http://localhost:${PORT}`));
