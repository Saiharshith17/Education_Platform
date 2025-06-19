from chatbot.services import get_llm,model_with_memory,reset_chat
import warnings
warnings.filterwarnings("ignore")
import redis
from uuid import uuid4
from fastapi import APIRouter, Request
from pydantic import BaseModel
from chatbot.config import REDIS_URL

llm=get_llm()
print("done")
rdb = redis.Redis.from_url(REDIS_URL, decode_responses=True)
print("done")
class ChatRequest(BaseModel):
    message: str
chat_router=APIRouter()
@chat_router.post("/chat/{user_id}")
async def chat(user_id: int, request: ChatRequest):

    try:
        response,full_chat=await model_with_memory(message=request.message, user_id=user_id,  llm=llm, rdb=rdb)
        return {
            "response":response,
            "chat_history":full_chat
        }
    except Exception as e:
        return {"error": str(e)}
    

@chat_router.post("/chat/reset/{user_id}")
def reset_chat_memory(user_id):
    if reset_chat(user_id,rdb):
        return {"message": "Session memory cleared and new session started."}
    return {"message": "No session found for this user."}
