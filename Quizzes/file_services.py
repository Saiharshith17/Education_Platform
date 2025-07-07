import nltk
import fitz
import base64
nltk.data.path.append("./nltk_data")
import tiktoken
from nltk.tokenize import sent_tokenize
import os
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
from io import BytesIO
from PIL import Image
import google.generativeai as genai
import re
import json
from Quizzes.config import GROQ_API_KEY,google_Api_key
import time

def get_and_extract_file(filepath):
    doc = fitz.open(filepath)
    text_content = "\n".join([page.get_text() for page in doc])
    image_content = []  
    for i, page in enumerate(doc):
        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_b64 = base64.b64encode(image_bytes).decode("utf-8")
            image_content.append(image_b64)
    return text_content,image_content


def split_text_into_chunks(text, model_name="gpt-3.5-turbo", max_tokens=3000):
    tokenizer = tiktoken.encoding_for_model(model_name)
    sentences = sent_tokenize(text)  
    chunks = []
    current_chunk = ""
    current_tokens = 0

    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue

        sentence_tokens = len(tokenizer.encode(sentence))
        if sentence_tokens > max_tokens:
            print("⚠️ A single sentence is too long and will be split directly.")
            words = sentence.split()
            temp_sentence = ""
            temp_tokens = 0
            for word in words:
                word_tokens = len(tokenizer.encode(word))
                if temp_tokens + word_tokens > max_tokens:
                    chunks.append(temp_sentence.strip())
                    temp_sentence = word + " "
                    temp_tokens = word_tokens
                else:
                    temp_sentence += word + " "
                    temp_tokens += word_tokens
            if temp_sentence:
                chunks.append(temp_sentence.strip())
            continue
        if current_tokens + sentence_tokens > max_tokens:
            chunks.append(current_chunk.strip())
            current_chunk = sentence + " "
            current_tokens = sentence_tokens
        else:
            current_chunk += sentence + " "
            current_tokens += sentence_tokens

    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks

def get_model():
    llm = ChatGroq(
    model_name="meta-llama/llama-4-scout-17b-16e-instruct",
    api_key=GROQ_API_KEY)
    genai.configure(api_key=google_Api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    return llm,model
def text_summary_chain(llm):
    
    prompt = PromptTemplate.from_template("""
You are an intelligent and concise summarization assistant.

A PDF document was provided by the user and its content—including sections like the index, cover page, and references—was extracted and split into multiple text chunks.

Your task is to summarize **each individual chunk**. The summary should:
- Be factual, clear, and concise
- It should be of high quality no useful knowledge should be missed.
- Highlight important definitions, processes, relationships, or data
- Avoid irrelevant details like page numbers, boilerplate text, or formatting artifacts
- Do not start with "this is summary" or "summary as heading"....etc. I want only direct summary.

Chunk:
{chunk}

Return only the summary, focusing on making it informative and quiz-relevant.
""")
    chain = prompt | llm | StrOutputParser()
    return chain


def get_final_summaries(filepath,llm):
    text_content,image_content=get_and_extract_file(filepath)
    Chunks=split_text_into_chunks(text_content,model_name="gpt-3.5-turbo", max_tokens=1000)
    chain=text_summary_chain(llm)
    all_summaries=[]
    for chunk in Chunks:
        summary=chain.invoke({"chunk":chunk})
        all_summaries.append(summary)
    final_summary = "\n\n".join(all_summaries)
    return final_summary


def describe_image_base64(image_b64: str, max_retries=3, wait_time=4) -> str:
    for attempt in range(max_retries):
        try:
            image_data = base64.b64decode(image_b64)
            image = Image.open(BytesIO(image_data))
            llm,model=get_model()
            prompt = (
                "You are an AI assistant. Give a short 3-line educational description of this image. "
                "Focus on what it visually represents, such as diagrams, graphs, labeled content, or learning concepts."
            )

            response = model.generate_content([prompt, image])

            if hasattr(response, 'text') and "Error:" not in response.text:
                return response.text.strip()
            else:
                print(f"[⚠️ Skipped: Unexpected content or format issue]")
                return ""

        except Exception as e:
            if "429" in str(e) or "quota" in str(e).lower():
                print(f"[Rate Limit Reached] Waiting {wait_time} seconds before retry...")
                time.sleep(wait_time)
            else:
                print(f"[Error: {e}]")
                return ""

    return ""  

def get_image_summary():
    image_summary = []
    text_content,image_content=get_and_extract_file()
    for i, img_b64 in enumerate(image_content):
        summary = describe_image_base64(img_b64)
        if summary:
            image_summary.append(summary)
        if i==50:
            break

    final_image_summary = "\n\n".join(image_summary)
    return final_image_summary

def count_tokens(text: str, model: str = "gpt-3.5-turbo") -> int:
    """
    Approximate token count using OpenAI's tokenizer.
    Works well for Gemini as a close estimation.
    """
    tokenizer = tiktoken.encoding_for_model(model)
    tokens = tokenizer.encode(text)
    return len(tokens)


def chain():
  system_prompt="""You are an expert computer science educator and quiz designer.

Generate a set of exactly **{no_of_questions} multiple-choice questions** (MCQs) for students who uploads a book and the summary of the book is given to you.
Book Summary:
{summary}

Follow these strict instructions:

1. Cover a wide range of important **subtopics** from the given topic in interview level.
2.All the questions should be generated from given summary only. Hints can be generated by your own.
3. Do not ask simple and silly questions. Questions standard should be very high and practical.
4. The questions should be arranged by **difficulty level**:
  - 2 Medium questions (basic concepts and definitions)
  - 4 Medium to Advanced questions (application-level, comparative questions)
  - 4 Advanced questions (analysis, multi-step reasoning, real-world problem-solving)
5. For each question, provide:
  - The question text
  - Exactly 4 answer options (labeled A, B, C, D)
  - The correct option label
  - A brief explanation of the correct answer
6. Generate random questions every time.
7. Focus on asking programming and coding questions in case of programming releated topics.
8. Format your output strictly in this JSON structure:
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

def get_quiz_llm():
    model = ChatGroq(
    model_name="llama-3.3-70b-versatile",
    temperature=0.5,
    groq_api_key=os.getenv("GROQ_API_KEY"))
    return model


async def quiz_with_doc(llm,final_summary):
    results=[]
    sys_prompt=chain()
    num=count_tokens(final_summary)//20000
    if num<=1:
        prompt=sys_prompt.format(no_of_questions=10,summary=final_summary)
        result=await llm.ainvoke(prompt)
        print(result)
        final_ans=cleaner(result.content)
        return final_ans
    else:
        if round(num)==2:
            chunks=split_text_into_chunks(final_summary,model_name="gpt-3.5-turbo", max_tokens=count_tokens//2)
            for chunk in chunks:
                prompt=sys_prompt.format(no_of_questions=6,summary=chunk)
                result=await llm.ainvoke(prompt)
                results.append(result.content)
        elif round(num)==3:
            chunks=split_text_into_chunks(final_summary,model_name="gpt-3.5-turbo", max_tokens=count_tokens//2)
            for chunk in chunks:
                prompt=sys_prompt.format(no_of_questions=5,summary=chunk)
                result=await llm.ainvoke(prompt)
                results.append(result.content)
        elif round(num)==4:
            chunks=split_text_into_chunks(final_summary,model_name="gpt-3.5-turbo", max_tokens=count_tokens//2)
            for chunk in chunks:
                prompt=sys_prompt.format(no_of_questions=4,summary=chunk)
                result=await llm.ainvoke(prompt)
                results.append(result.content)
        else:
            chunks=split_text_into_chunks(final_summary,model_name="gpt-3.5-turbo", max_tokens=count_tokens//2)
            for chunk in chunks:
                prompt=sys_prompt.format(no_of_questions=5,summary=chunk)
                result=await llm.ainvoke(prompt)
                results.append(result.content)
        final_Result=final_summary = "\n\n".join(results)
        final_ans=cleaner(final_Result)
        return final_ans
    

def img_chain():
  system_prompt="""You are an expert computer science educator and quiz designer.

Generate a set of exactly **3 multiple-choice questions** (MCQs) for students who uploads a book and the summary of the images in the book is given to you.
The summary is generated in such a way that one by one image is given to the gemini flash 1.5 then it gives a 3 line summary for each image
Images Summary:
{img_summary}

Follow these strict instructions:

1. Cover a wide range of important **subtopics** from the given topic in interview level.
2.All the questions should be generated from given summary only. Hints can be generated by your own.
3. Do not ask simple and silly questions. Questions standard should be very high and practical.
4. The questions should be arranged by **difficulty level**:
  - 2 Advanced questions (analysis, multi-step reasoning, real-world problem-solving)
5. For each question, provide:
  - The question text
  - Exactly 4 answer options (labeled A, B, C, D)
  - The correct option label
  - A brief explanation of the correct answer
6. Generate random questions every time.
7. Focus on asking programming and coding questions in case of programming releated topics.
8. Format your output strictly in this JSON structure:
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

async def quiz_with_img(img_summary,llm):
    sys_prompt=img_chain()
    prompt=sys_prompt.format(img_summary=img_summary)
    result=await llm.ainvoke(prompt)
    print(result)
    final_ans=cleaner(result.content)
    return final_ans