import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Verify API key is loaded
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error("❌ Missing OPENROUTER_API_KEY in .env");
  process.exit(1);
}

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
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://deepconverseai-13.onrender.com", // Replace with your actual URL
          "X-Title": "AI Chat App",       // Your app name
          "Content-Type": "application/json"
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
    console.error("API Error:", error.response?.data || error.message);
    
    res.status(500).json({
      error: "API request failed",
      botMessage: {
        text: getErrorMessage(error),
        sender: "bot"
      }
    });
  }
});

function getErrorMessage(error) {
  if (error.response?.status === 401) {
    return "Authentication failed. Please check the API configuration.";
  }
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  return "Sorry, I encountered an error. Please try again later.";
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
