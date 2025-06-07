import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

// CORS configuration
app.use(cors({
  origin: "*", // Allow all origins (adjust for production)
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));
app.use(express.json());

// Direct API key (replace with your actual key)
const OPENROUTER_API_KEY = "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";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

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
          "HTTP-Referer": "https://deepconverseai.onrender.com",
          "X-Title": "DeepConverse AI"
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
    console.error("API Error:", error.message);
    
    let errorMessage = "Sorry, I encountered an error processing your request.";
    if (error.response?.data?.error?.message) {
      errorMessage = error.response.data.error.message;
    }

    res.status(500).json({
      botMessage: {
        text: errorMessage,
        sender: "bot"
      }
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
