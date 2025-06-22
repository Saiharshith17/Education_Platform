import warnings
warnings.filterwarnings("ignore")
from Quizzes.services import get_llm,quiz_with_llm
from fastapi import APIRouter
from pydantic import BaseModel


class QuizRequest(BaseModel):
    Topic:str

model=get_llm()

quiz_router=APIRouter()
@quiz_router.post("/quiz")
async def Quiz_generator(request:QuizRequest):
    try:
        final_quiz=await quiz_with_llm(llm=model,Topic=request.Topic)
        return {
            "quiz":final_quiz
        }
    except Exception as e:
        return {"error":str(e)}