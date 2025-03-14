import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { CiMusicNote1 } from "react-icons/ci";
import axios from "axios";
import { TbRobot } from "react-icons/tb";

const Landing = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMoodInputVisible, setIsMoodInputVisible] = useState(false);
  const [mood, setMood] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [playlist, setPlaylist] = useState(null);
  const allMails = JSON.parse(localStorage.getItem("guardianEmails")) || [];
  const [allGuardians, setAllGuardians] = useState([]);
  const [isGuardianModalOpen, setIsGuardianModalOpen] = useState(false); // New state for modal
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const name = user?.name;
  const [loading, setLoading] = useState(false);

  const handleChatbotClick = () => {
    if (allGuardians.length === 0) {
      setIsGuardianModalOpen(true); // Show the modal if no guardians are added
    } else {
      setIsChatOpen(!isChatOpen); // Open the chatbot if guardians are added
    }
  };

  const handleSendMessage = async () => {
    setLoading(true);
    if (userInput.trim()) {
      setMessages([...messages, { sender: "user", text: userInput }]);
      setUserInput("");

      // Check for sensitive words
      const sensitiveWords = ["suicide", "kill", "self-harm", "die"];
      const containsSensitive = sensitiveWords.some((word) =>
        userInput.toLowerCase().includes(word)
      );

      if (containsSensitive) {
        // Send email to all guardians
        await sendAlertEmail(userInput);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "bot",
            text: "Please reach out to this number 9100972237 ",
          },
        ]);
      }

      // Simulate sending user input to ML endpoint
      const mlResponse = await fetchMLResponse(userInput);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: mlResponse },
      ]);

      setLoading(false);
    }
  };

  const sendAlertEmail = async (userInput) => {
    try {
      const response = await fetch("http://localhost:3000/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          userInput,
          guardianEmails: allMails,
        }),
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error sending alert email:", error);
    }
  };

  const handleMoodSelection = async (selectedMood) => {
    setMood(selectedMood);
    setIsMoodInputVisible(false);

    // Fetch playlist data based on mood
    const playlistData = await fetchMoodResponse(selectedMood);
    setPlaylist(playlistData);

    // Add a message to the chat indicating the mood and playlist
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "bot",
        text: `Here's a playlist for your "${selectedMood}" mood:`,
        playlist: playlistData,
      },
    ]);
    setLoading(false);
  };

  const fetchMLResponse = async (userInput) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input: userInput }),
      });
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error fetching ML response:", error);
      return "Sorry, something went wrong. Please try again.";
    }
  };

  const fetchMoodResponse = async (mood) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/recommend_playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood }),
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error fetching mood response:", error);
      return null;
    }
  };

  const getUser = async () => {
    try {
      const { data } = await axios.post("http://localhost:3000/user/getUser", {
        userId,
      });
      setAllGuardians(data?.user?.guardians);

      // Extract email addresses and store them in local storage
      const guardianEmails =
        data?.user?.guardians?.map((guardian) => guardian.email) || [];
      localStorage.setItem("guardianEmails", JSON.stringify(guardianEmails));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <Header />
      <div className="bg-gray-100">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-20">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold">
              Prioritize Your Mental Health
            </h1>
            <p className="mt-6 text-xl max-w-2xl mx-auto">
              Mental Health NLP (Natural Language Processing) refers to using
              NLP techniques to analyze, interpret, and respond to text or
              speech related to mental health. It plays a significant role in
              building intelligent systems, like chatbots , to provide mental
              health support.
            </p>
            <button onClick={handleChatbotClick} className="mt-8 bg-white text-purple-600 font-bold py-3 px-6 rounded-full hover:bg-gray-200">
              Start Your Journey
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              Why Choose Our Mental Health Support System?
            </h2>
            <p className="text-gray-600 text-lg mt-4 mb-10">
              Explore features designed to help you manage stress, anxiety, and
              improve your overall well-being.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature Cards */}
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <img
                  src="https://ddi-dev.com/uploads/media/news/0001/02/584668831a98d094bf9ceb0a533d0984149e044f.jpeg"
                  alt="AI Chatbot Support"
                  className="h-40 w-full object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  AI Chatbot Support
                </h3>
                <p className="text-gray-600 mt-2">
                  Get instant, empathetic responses to your concerns, available
                  24/7 to provide comfort and support.
                </p>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b"
                  alt="Personalized Insights"
                  className="h-40 w-full object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  Personalized Insights
                </h3>
                <p className="text-gray-600 mt-2">
                  Understand your mental health better with tailored insights
                  and actionable recommendations.
                </p>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1517832207067-4db24a2ae47c"
                  alt="Stress Management Tools"
                  className="h-40 w-full object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  Stress Management Tools
                </h3>
                <p className="text-gray-600 mt-2">
                  Discover exercises, mindfulness techniques, and coping
                  strategies to stay grounded and reduce stress.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Chatbot Floating Button */}
        <div className="fixed bottom-10 right-10">
          <button
            onClick={handleChatbotClick}
            className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
        </div>

        {/* Chatbot Modal */}
        {isChatOpen && (
          <div className="fixed bottom-24 right-10 w-[550px]   bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="bg-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="text-lg font-semibold">Mental Health Chatbot</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 h-96 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </span>
                  {msg.playlist && (
                    <div className="mt-2">
                      <h4 className="font-semibold">
                        Playlist for {msg.playlist.mood}:
                      </h4>
                      <div className="space-y-2">
                        {msg.playlist.tracks.map((track, idx) => {
                          const searchQuery = encodeURIComponent(
                            `${track.track_name} ${track.artists}`
                          );
                          const spotifySearchUrl = `https://open.spotify.com/search/${searchQuery}`;

                          return (
                            <a
                              key={idx}
                              href={spotifySearchUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md"
                            >
                              <img
                                src={track.image_url}
                                alt={track.track_name}
                                className="w-10 h-10 rounded"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {track.track_name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {track.artists}
                                </p>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              {isMoodInputVisible && (
                <div className="mb-4">
                  <select
                    onChange={(e) => handleMoodSelection(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select your mood</option>
                    <option value="happy">Happy</option>
                    <option value="sad">Sad</option>
                    <option value="angry">Angry</option>
                    <option value="anxious">Anxious</option>
                  </select>
                </div>
              )}
              <div className="flex">
                <button
                  onClick={() => setIsMoodInputVisible(!isMoodInputVisible)}
                  className="bg-gray-200 text-gray-800 p-2 rounded-lg mr-2 hover:bg-gray-300"
                >
                  <CiMusicNote1 />
                </button>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-purple-600 text-white p-2 rounded-lg ml-2 w-[60px] h-[55px] hover:bg-purple-700 flex justify-center items-center"
                >
                  {loading ? (
                    <TbRobot size={30} className="animate-bounce text-black " />
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Guardian Required Modal */}
        {isGuardianModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Guardian Required</h3>
              <p className="text-gray-600">
                You need to add at least one guardian to access the chatbot.
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setIsGuardianModalOpen(false)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <section id="contact" className="py-20 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              Reach Out to Us
            </h2>
            <p className="text-gray-600 text-lg mt-4 mb-8">
              Have questions or need support? Connect with our team for
              personalized assistance and resources.
            </p>
            <button onClick={() => setIsContactOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full">
              Contact Us
            </button>
          </div>
        </section>
        {/* Contact Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Contact Details</h2>
            <p><strong>Name:</strong> Rajiya</p>
            <p><strong>Email:</strong> rajiyask221@gmail.com</p>
            <p><strong>Phone:</strong> 7997902631</p>

            {/* Close Button */}
            <button
              onClick={() => setIsContactOpen(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

        {/* Footer */}
        <footer className="bg-gray-800 py-6">
          <div className="container mx-auto text-center text-white">
            <p>© 2024 MentalHealthAI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
