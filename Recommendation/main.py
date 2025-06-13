from fastapi import FastAPI
from Recommendation.router.recommend_routes import router

app = FastAPI()

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Course Recommendation API"}