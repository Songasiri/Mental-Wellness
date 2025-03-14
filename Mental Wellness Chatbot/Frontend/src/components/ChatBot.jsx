import React, { useState } from "react";

const ChatBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMoodDropdownVisible, setIsMoodDropdownVisible] = useState(false);
  const [mood, setMood] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setMessages([...messages, { sender: "user", text: userInput }]);
      setUserInput("");

      // Simulate chatbot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: `I see. How can I assist you with that?` },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 focus:outline-none"
      >
        💬 Chat
      </button>

      {isChatOpen && (
        <div className="bg-white rounded-lg shadow-lg p-4 mt-4 min-h-[600px] max-h-[80vh] w-80 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold">Mental Health Chatbot</h4>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 text-sm ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block px-3 py-1 rounded-lg ${
                    message.sender === "user"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="relative flex items-center">
            {/* User Input */}
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 rounded-l-lg border-gray-300 p-2 focus:ring-purple-200 focus:border-purple-500"
              placeholder="Type your message"
            />

            {/* Mood Dropdown Icon */}
            <div className="relative">
              <button
                onClick={() => setIsMoodDropdownVisible(!isMoodDropdownVisible)}
                className="bg-gray-200 text-gray-800 px-3 py-2 hover:bg-gray-300 focus:outline-none"
              >
                🎭
              </button>

              {/* Mood Dropdown */}
              {isMoodDropdownVisible && (
                <div className="absolute right-0 top-10 bg-white border border-gray-200 shadow-lg rounded-lg w-40 z-10">
                  <div className="p-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your mood
                    </label>
                    <input
                      type="text"
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-200 focus:border-purple-500"
                      placeholder="e.g., Happy"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
