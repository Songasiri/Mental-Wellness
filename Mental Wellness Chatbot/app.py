from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
from typing import List
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# Load environment variables
load_dotenv()

genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

model = genai.GenerativeModel('gemini-1.5-flash')

# Sensitive words to monitor
SENSITIVE_WORDS = ["suicide", "kill", "self-harm", "depression", "die"]

# Initial prompt
INITIAL_PROMPT = """You are a compassionate and empathetic mental health chatbot designed to assist users in managing their mental well-being. Your primary goal is to provide a safe, non-judgmental, and supportive environment where users can share their thoughts, feelings, and concerns. You are powered by advanced artificial intelligence, enabling you to understand and respond thoughtfully to user inputs.

You must:

- Listen attentively to the user's concerns and validate their feelings with warmth and empathy.
- Provide evidence-based techniques for stress relief, anxiety management, emotional regulation, and self-care.
- Offer suggestions for mindfulness exercises, grounding techniques, or journaling prompts when appropriate.
- Encourage users to seek professional help when their challenges exceed your scope as an AI chatbot. Always clarify that you are not a substitute for professional medical advice or therapy.
- Avoid judgmental language or making any assumptions about the user's experiences.
- Always prioritize user privacy and confidentiality, making the user feel secure in expressing themselves.
- Maintain a calm, supportive, and understanding tone throughout the interaction.
- Provide helpline information for users in distress or experiencing a crisis based on their region, ensuring they have access to immediate support.
- Remember to mention that you are an AI chatbot in your responses, so users understand your capabilities and limitations. For example, if a user asks for a diagnosis or specific medical advice, gently explain your role as an AI, offer general guidance, and encourage them to consult a licensed professional.
- Dont mention u are an ai chatbot
- give advice as a mental helath consultant 
- u can ask follow up questions why u feel so 
- and then give suggestions
- dont give answers in large parah 
- like consultant u need to talk
- if a user say hello in the start u just need to mention Hii , I am mental health assistant , How may I help u
Your responses should always be clear, thoughtful, empathetic, and based on widely accepted mental health principles. Tailor your tone to match the user's level of distress, providing extra support and reassurance when they seem overwhelmed."""

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware to allow requests from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Store conversation history for the session
conversation_log: List[str] = []

class ChatRequest(BaseModel):
    user_input: str

@app.on_event("startup")
def initialize_conversation():
    """Add the initial prompt to the conversation log when the server starts."""
    global conversation_log
    conversation_log = [f"System: {INITIAL_PROMPT}"]

# Initialize Spotify API client
spotify_client_credentials_manager = SpotifyClientCredentials(client_id='9959a1d8eb1b4f378da63ad9b59335d1', client_secret='054e13dc8da540338247c00a933a20ac')
sp = spotipy.Spotify(client_credentials_manager=spotify_client_credentials_manager)

mood_to_genre = {
    "happy": "pop",
    "sad": "folk",
    "angry": "rock",
    "fearful": "rap",
    "surprised": "dance",
    "neutral": "r&b"
}

class MoodRequest(BaseModel):
    mood: str

def query_spotify_top_tracks(genre, limit=10):
    query = f'genre:"{genre}"'

    try:
        results = sp.search(q=query, type="track", limit=limit)
        tracks = results['tracks']['items']
        return [
            {
                "track_name": track['name'],
                "artists": ', '.join([artist['name'] for artist in track['artists']]),
                "album": track['album']['name'],
                "image_url": track['album']['images'][0]['url'] if track['album']['images'] else None
            }
            for track in tracks
        ]
    except Exception as e:
        print(f"Error querying Spotify API: {e}")
        return []

@app.post("/recommend_playlist")
def recommend_playlist(request: MoodRequest):
    mood = request.mood.lower()

    genre = mood_to_genre.get(mood)
    if not genre:
        return {"error": "Invalid mood. Please choose from happy, sad, angry, fearful, surprised, or neutral."}

    tracks = query_spotify_top_tracks(genre)
    if not tracks:
        return {"message": f"No tracks found for the selected mood '{mood}'."}

    response = {"mood": mood, "genre": genre, "tracks": tracks}
    return response

@app.post("/chat")
async def chatbot(request: ChatRequest):
    global conversation_log
    user_input = request.user_input

    conversation_log.append(f"User: {user_input}")

    try:
        response = model.generate_content("\n".join(conversation_log))
        bot_response = response.text if response.text else "Sorry, I couldn't process that."

        conversation_log.append(f"Bot: {bot_response}")

        contains_sensitive = any(word in user_input.lower() for word in SENSITIVE_WORDS)

        return {
            "response": bot_response,
            "alert": contains_sensitive,
            "conversation_log": conversation_log
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing the request: {str(e)}")

@app.on_event("shutdown")
def reset_conversation():
    """Reset the conversation log when the server shuts down."""
    global conversation_log
    conversation_log = []

@app.get("/")
def root():
    """Root endpoint to verify the API is running."""
    return {"message": "Welcome to the Mental Health Chatbot API!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)