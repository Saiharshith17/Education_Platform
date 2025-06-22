from dotenv import load_dotenv
import warnings
warnings.filterwarnings("ignore")
from langchain_groq import ChatGroq
import json
import re
from Quizzes.config import GROQ_API_KEY 
def get_llm():
  model = ChatGroq(
  model_name="llama-3.3-70b-versatile",
  temperature=0.5,
  groq_api_key=GROQ_API_KEY)
  return model

def chain():
  system_prompt="""You are an expert computer science educator and quiz designer.

Generate a set of exactly **10 multiple-choice questions** (MCQs) for students learning the topic: **{topic_name}**.

Follow these strict instructions:

1. Cover a wide range of important **subtopics** from the given topic in interview level.
2. Do not ask simple and silly questions. Questions standard should be very high and practical.
3. The questions should be arranged by **difficulty level**:
  - 2 Medium questions (basic concepts and definitions)
  - 4 Medium to Advanced questions (application-level, comparative questions)
  - 4 Advanced questions (analysis, multi-step reasoning, real-world problem-solving)
4. For each question, provide:
  - The question text
  - Exactly 4 answer options (labeled A, B, C, D)
  - The correct option label
  - A brief explanation of the correct answer
5. Generate random questions every time.
6. Focus on asking programming and coding questions in case of programming releated topics.
7. Format your output strictly in this JSON structure:
```json
[
{{
  "level": "medium",
  "question": "Your question here",
  "options": {{
    "A": "Option A",
    "B": "Option B",
    "C": "Option C",
    "D": "Option D"
  }},
  "answer": "C",
  "hint":"A basic hint here",
  "explanation": "Your explanation here"
}},
...
]
"""
  return system_prompt

def cleaner(llm_response):
  cleaned = re.sub(r"```json|```", "", llm_response).strip()
  answer=json.loads(cleaned)
  return answer

async def quiz_with_llm(llm,Topic):
  sys_prompt=chain()
  prompt=sys_prompt.format(topic_name=Topic)
  result=await llm.ainvoke(prompt)
  final_ans=cleaner(result.content)
  return final_ans