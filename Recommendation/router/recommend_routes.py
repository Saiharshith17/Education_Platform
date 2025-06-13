from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from ..services import fetch_all_courses, recommend_courses

router = APIRouter()

class RecommendationRequest(BaseModel):
    course_ids: List[str]
    tags:List[str]

@router.post("/recommend")
async def get_recommendations(request: RecommendationRequest):
    try:
        if not request.tags:
            raise HTTPException(status_code=400, detail="tags cannot be empty")
        all_courses = fetch_all_courses()
        
        if not all_courses:
            raise HTTPException(status_code=404, detail="No courses found")
        recommendations = recommend_courses(request.course_ids, all_courses,request.tags)
        
        return {"recommendations": recommendations}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))