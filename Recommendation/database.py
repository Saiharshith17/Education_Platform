from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv
load_dotenv()

uri = os.getenv("DB_URI")

client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Connected to MongoDB!")
except Exception as e:
    print(e)

db = client["edu_platform"]
collection = db["courses"]

def get_collection():
    return collection