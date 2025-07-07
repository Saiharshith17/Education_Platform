import os
from dotenv import load_dotenv
def get_env():
    load_dotenv()
    GROQ_API_KEY=os.getenv("GROQ_API_KEY")
    google_api_key = os.getenv("GOOGLE_GENAI_API_KEY")
    return GROQ_API_KEY,google_api_key
GROQ_API_KEY,google_Api_key=get_env()