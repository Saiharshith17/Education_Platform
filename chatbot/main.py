from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from chatbot.routes import chat
import uvicorn
app = FastAPI()

origins = [
    "http://localhost:5173",  
    "http://127.0.0.1:5173"   
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.chat_router)

if __name__ == "__main__":
    uvicorn.run("chatbot.main:app", host="127.0.0.1", port=8001, reload=True)
