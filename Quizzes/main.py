from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Quizzes.routes import quiz
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

app.include_router(quiz.quiz_router)

if __name__ == "__main__":
    uvicorn.run("Quizzes.main:app", host="127.0.0.1", port=8003, reload=True)
