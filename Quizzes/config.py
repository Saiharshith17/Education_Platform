import os
from dotenv import load_dotenv
def get_env():
    load_dotenv()
    GROQ_API_KEY=os.getenv("GROQ_API_KEY")
    return GROQ_API_KEY
GROQ_API_KEY=get_env()