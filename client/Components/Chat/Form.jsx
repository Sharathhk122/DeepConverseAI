// Form.jsx
import React, { useState, useEffect, useRef } from "react";
import { MdSend, MdContentCopy, MdEdit, MdRefresh } from "react-icons/md";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const Form = ({ close, proMember, address, freeTrail, messages, setMessages }) => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const inputText = editingMessageId !== null ? editedMessage : userInput;
    if (inputText.trim() === "") return;

    // If editing an existing message
    if (editingMessageId !== null) {
      const updatedMessages = messages.map((msg, idx) => 
        idx === editingMessageId ? { ...msg, text: editedMessage } : msg
      );
      setMessages(updatedMessages);
      setEditingMessageId(null);
      setEditedMessage("");
      return;
    }

    const userMessage = { text: userInput, sender: "user" };
    setMessages([...messages, userMessage]);

    setLoading(true);
    try {
     
        const response = await axios.post(
  "https://deepconverseai.onrender.com/api/get-bot-response",
  { userInput }
);
      });
      const cleanedBotMessage = response.data.botMessage.text.replace(/<\/s>$/, "");
      const botMessage = { 
        text: cleanedBotMessage, 
        sender: "bot", 
        isMarkdown: true 
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = { 
        text: "Sorry, I could not fetch a response.", 
        sender: "bot",
        isMarkdown: false 
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setLoading(false);
    setUserInput("");
  };

  const handleRetry = async (index) => {
    if (index <= 0 || messages[index - 1].sender !== "user") return;
    
    const userInput = messages[index - 1].text;
    setLoading(true);
    
    try {
      const response = await axios.post("https://deepconverseai.onrender.com/get-bot-response", {
        userInput,
      });
      const cleanedBotMessage = response.data.botMessage.text.replace(/<\/s>$/, "");
      const updatedMessages = [...messages];
      updatedMessages[index] = { 
        ...updatedMessages[index], 
        text: cleanedBotMessage 
      };
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error retrying:", error);
      const updatedMessages = [...messages];
      updatedMessages[index] = { 
        ...updatedMessages[index], 
        text: "Sorry, I could not fetch a response." 
      };
      setMessages(updatedMessages);
    }
    
    setLoading(false);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: Show a toast notification
  };

  const handleEdit = (index) => {
    setEditingMessageId(index);
    setEditedMessage(messages[index].text);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userInput, editedMessage]);

  const MarkdownRenderer = ({ text }) => {
    return (
      <ReactMarkdown
        children={text}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          h1: ({ node, ...props }) => <h1 style={{ fontSize: '1.5em', margin: '15px 0' }} {...props} />,
          h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.3em', margin: '12px 0' }} {...props} />,
          h3: ({ node, ...props }) => <h3 style={{ fontSize: '1.1em', margin: '10px 0' }} {...props} />,
          p: ({ node, ...props }) => <p style={{ margin: '8px 0', lineHeight: '1.5' }} {...props} />,
          ul: ({ node, ...props }) => <ul style={{ marginLeft: '20px', paddingLeft: '20px' }} {...props} />,
          ol: ({ node, ...props }) => <ol style={{ marginLeft: '20px', paddingLeft: '20px' }} {...props} />,
          li: ({ node, ...props }) => <li style={{ marginBottom: '5px' }} {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              style={{
                borderLeft: '3px solid #ccc',
                paddingLeft: '10px',
                margin: '10px 0',
                color: '#666',
                fontStyle: 'italic',
              }}
              {...props}
            />
          ),
        }}
      />
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        className="chat-messages"
        style={{
          overflowY: "auto",
          flex: 1,
          marginBottom: "20px",
          padding: "10px",
          maxHeight: "calc(100vh - 200px)",
          paddingBottom: "50px",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-wrapper ${message.sender}`}
            style={{
              display: "flex",
              flexDirection: message.sender === "user" ? "row-reverse" : "row",
              alignItems: "flex-start",
              marginBottom: "15px",
            }}
          >
            {message.sender === "user" ? (
              <div style={{ display: "flex", alignItems: "flex-start", maxWidth: "80%" }}>
                <div
                  style={{
                    color: "#FFFFFF",
                    backgroundColor: "#2c2c2e",
                    padding: "15px",
                    borderRadius: "10px",
                    maxWidth: "100%",
                    wordWrap: "break-word",
                    marginLeft: "10px",
                    whiteSpace: "pre-wrap",
                    position: "relative",
                  }}
                >
                  {editingMessageId === index ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <textarea
                        ref={textareaRef}
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{
                          color: "#FFFFFF",
                          backgroundColor: "#3a3a3c",
                          border: "1px solid #555",
                          borderRadius: "5px",
                          padding: "10px",
                          width: "100%",
                          minHeight: "100px",
                          resize: "vertical",
                        }}
                        autoFocus
                      />
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => {
                            setEditingMessageId(null);
                            setEditedMessage("");
                          }}
                          style={{
                            padding: "5px 15px",
                            backgroundColor: "#ff4444",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSend(e);
                          }}
                          style={{
                            padding: "5px 15px",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {message.text}
                      <div style={{ 
                        position: "absolute", 
                        top: "5px", 
                        right: "5px", 
                        display: "flex",
                        gap: "5px",
                      }}>
                        <button
                          onClick={() => handleCopy(message.text)}
                          style={{
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "none",
                            borderRadius: "50%",
                            width: "25px",
                            height: "25px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#FFFFFF",
                          }}
                        >
                          <MdContentCopy size={14} />
                        </button>
                        <button
                          onClick={() => handleEdit(index)}
                          style={{
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "none",
                            borderRadius: "50%",
                            width: "25px",
                            height: "25px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#FFFFFF",
                          }}
                        >
                          <MdEdit size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <img
                  src="/images/img3.jpg"
                  alt="user"
                  style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                />
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "flex-start", maxWidth: "80%" }}>
                <img
                  src="/images/img1.jpg"
                  alt="bot"
                  style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "10px" }}
                />
                <div
                  style={{
                    color: "#FFFFFF",
                    backgroundColor: "#3a3a3c",
                    padding: "15px",
                    borderRadius: "10px",
                    maxWidth: "100%",
                    wordWrap: "break-word",
                    position: "relative",
                  }}
                >
                  {message.isMarkdown ? (
                    <MarkdownRenderer text={message.text} />
                  ) : (
                    message.text
                  )}
                  <div style={{ 
                    position: "absolute", 
                    top: "5px", 
                    right: "5px", 
                    display: "flex",
                    gap: "5px",
                  }}>
                    <button
                      onClick={() => handleCopy(message.text)}
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "none",
                        borderRadius: "50%",
                        width: "25px",
                        height: "25px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#FFFFFF",
                      }}
                    >
                      <MdContentCopy size={14} />
                    </button>
                    <button
                      onClick={() => handleRetry(index)}
                      disabled={loading}
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "none",
                        borderRadius: "50%",
                        width: "25px",
                        height: "25px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: loading ? "not-allowed" : "pointer",
                        color: "#FFFFFF",
                        opacity: loading ? 0.5 : 1,
                      }}
                    >
                      <MdRefresh size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            padding: "10px",
          }}>
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form 
        id="form_input_data" 
        className="msger-inputarea" 
        onSubmit={handleSend}
        style={{
          padding: "10px",
          backgroundColor: "#1c1c1e",
          borderRadius: "8px",
          marginBottom: "10px",
        }}
      >
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          width: "100%",
          position: "relative",
        }}>
          <textarea
            ref={textareaRef}
            name="prompt"
            className="msger-input"
            placeholder="Ask any question here..."
            value={editingMessageId !== null ? editedMessage : userInput}
            onChange={(e) => 
              editingMessageId !== null 
                ? setEditedMessage(e.target.value) 
                : setUserInput(e.target.value)
            }
            onKeyDown={handleKeyDown}
            style={{
              color: "#FFFFFF",
              backgroundColor: "#1c1c1e",
              borderRadius: "5px",
              padding: "15px 50px 15px 15px",
              width: "100%",
              border: "1px solid #3a3a3c",
              outline: "none",
              resize: "none",
              minHeight: "80px",
              maxHeight: "200px",
              fontFamily: "inherit",
              fontSize: "inherit",
              lineHeight: "1.5",
            }}
            rows={3}
          />
          <button
            onClick={handleSend}
            type="submit"
            className="msger-send-btn"
            disabled={loading}
            style={{ 
              position: "absolute",
              right: "10px",
              bottom: "10px",
              backgroundColor: "#4CAF50", 
              borderRadius: "50%", 
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "none",
              width: "36px",
              height: "36px",
            }}
          >
            <MdSend className="icon_size" style={{ color: "#FFFFFF" }} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
