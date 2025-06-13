from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://tejatanush47:tejatanush@cluster0.7fqzuov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db=client["edu_platform"]
collection=db["courses"]

def fetch_all_courses(collection):
    return list(collection.find())

from bson import ObjectId

import random

def recommend_courses(course_list, all_courses):
    """
    Simple course recommendation based on tag matching with ranking priority.
    
    Args:
        course_list: List of course IDs that user has enrolled/completed
        all_courses: List of all available courses
    
    Returns:
        List of recommended course titles
    """
    course_list = [ObjectId(cid) if isinstance(cid, str) else cid for cid in course_list]
    # Determine recommendations per course based on course list size
    if len(course_list) <= 3:
        recs_per_course = 5
    elif len(course_list) <= 8:
        recs_per_course = 4
    else:
        recs_per_course = 3
    
    # Randomize all courses to avoid bias
    shuffled_courses = all_courses.copy()
    random.shuffle(shuffled_courses)
    
    # Create course dictionary for quick lookup
    course_dict = {course["_id"]: course for course in shuffled_courses}
    #print(course_dict)
    # Track purchased and recommended courses
    purchased_course_ids = set(course_list)
    recommended_courses = []
    recommended_ids = set()
    
    # For each course in user's list, find recommendations
    for course_id in course_list:
        if course_id not in course_dict:
            continue
            
        source_course = course_dict[course_id]
        course_recommendations = []
        
        # Try each rank level (1, 2, 3) in priority order
        for rank in ["1", "2", "3"]:
            if len(course_recommendations) >= recs_per_course:
                break
                
            # Get tags for current rank from source course
            source_tags = set(source_course.get("tags", {}).get(rank, []))
            if not source_tags:
                continue
            
            # Find courses with matching tags
            for course in shuffled_courses:
                if len(course_recommendations) >= recs_per_course:
                    break
                    
                # Skip if course is purchased, already recommended, or same course
                if (course["_id"] in purchased_course_ids or 
                    course["_id"] in recommended_ids or
                    course["_id"] == course_id):
                    continue
                
                # Get target course tags for current rank
                target_tags = set(course.get("tags", {}).get(rank, []))
                
                # If there's any common tag, add to recommendations
                if source_tags & target_tags:  # Intersection check
                    course_recommendations.append(course["title"])
                    recommended_ids.add(course["_id"])
        
        recommended_courses.extend(course_recommendations)
    
    return recommended_ids

course_list=["684ab367e51ae7d6195a94be"]
courses=fetch_all_courses(collection)
recommendations=recommend_courses(course_list,courses)
print(recommendations)