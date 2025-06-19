import warnings
warnings.filterwarnings("ignore")
from langchain_groq import ChatGroq
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage
from langchain_community.chat_message_histories import RedisChatMessageHistory
from uuid import uuid4
from chatbot.config import REDIS_URL,GROQ_API_KEY


def get_llm():
    model = ChatGroq(
    model_name="llama-3.3-70b-versatile",
    temperature=0.3,
    groq_api_key=GROQ_API_KEY)
    return model

def get_session_history(session_id: str):
    return RedisChatMessageHistory(
        session_id=session_id,
        url=REDIS_URL,  
        ttl=3600  
    )

def CHAIN(llm):
    system_prompt="""You are Educational Chatbot, a highly knowledgeable and professional AI assistant for solving engineering students questions.

Your responsibilities are as follows:
1. You must **only** answer questions related to **engineering**.Mainly try to focus on 
 - Artificial Intelligence
 - Frontened development
 - Backened development
 - Machine Learning
 - Generative AI
 - DSA
 - Fundamentals of Computers
 - Fullstack Development

2. If a user asks any question **outside the above domain**, **politely reject** the request by saying:
> "I'm here to assist with engineering-related topics only. Please ask a question within the engineering domain."

3. Always give **precise**, **professionally written**, and **well-structured answers** with minimal but relevant explanations.

4. Avoid any kind of informal tone, unnecessary elaboration, or irrelevant context.

5. When applicable, use technical language suitable for students and aspiring engineers, and explain terms clearly without oversimplifying.

Your goal is to serve as a reliable academic support system for engineering students.
"""
    prompt=ChatPromptTemplate.from_messages(
        [
        ("system",system_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}")
        ]
    )
    chain=prompt | llm
    return RunnableWithMessageHistory(
        runnable=chain,
        get_session_history=get_session_history,
        input_messages_key="input",
        history_messages_key="chat_history"
    )

async def model_with_memory(message,user_id,llm, rdb):
    chain=CHAIN(llm)
    session_key = f"user_session:{user_id}"
    session_id = rdb.get(session_key)
    if not session_id:
        session_id = str(uuid4())
        rdb.set(session_key, session_id, ex=3600)

    result = await chain.ainvoke(
        {"input": message},
        config={"configurable": {"session_id": session_id}}
    )
    history = get_session_history(session_id).messages
    full_chat = []
    for msg in history:
        role = "User" if isinstance(msg, HumanMessage) else "AI"
        full_chat.append(f"{role}: {msg.content}")
    
    return result.content,full_chat

def reset_chat(user_id,rdb):
    session_key = f"user_session:{user_id}"
    session_id = rdb.get(session_key)
    if session_id:
        history = get_session_history(session_id)
        history.clear()
        rdb.delete(session_key)
        return True
    return False